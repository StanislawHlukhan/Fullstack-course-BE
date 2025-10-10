import { ITransactionManager } from 'src/types/ITransaction';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { IPostRepo } from 'src/types/IPostRepo';
import { ICommentRepo } from 'src/types/ICommentRepo';
import { IArchiveRepo } from 'src/types/IArchiveRepo';
import { ITagToPostRepo } from 'src/types/ITagToPostRepo';

export async function hardRestoreUser(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  tagToPostRepo: ITagToPostRepo;
  transactionManager: ITransactionManager;
  userId: string;
}) {
  return await params.transactionManager.execute(async (ctx) => {
    const archive = await params.archiveRepo.getArchiveForUser(params.userId);
    if (!archive) {
      throw new Error('Archive not found for user');
    }

    const userData = archive.userData as any;
    const postsData = (archive.postsData as any[]) || [];
    const commentsData = (archive.commentsData as any[]) || [];
    const tagsData = (archive.tagsData as any[]) || [];

    // Restore profile
    const activatedAtRaw = (userData.activatedAt ?? null);
    const newProfile = await params.profileRepo.createProfile({
      name: userData.name,
      email: userData.email,
      footSize: userData.footSize,
      subId: userData.subId,
      systemRole: userData.systemRole,
      activatedAt: activatedAtRaw ? new Date(activatedAtRaw) : null,
      deletedAt: null
    }, ctx.sharedTx);

    const oldToNewPostId: Record<string, string> = {};

    // Restore posts
    if (postsData.length > 0) {
      const postsToCreate = postsData.map(p => ({
        title: p.title,
        description: p.description,
        createdBy: newProfile.id
      }));
      
      const newPosts = await params.postRepo.createPosts(postsToCreate, ctx.sharedTx);
      
      // Map old IDs to new IDs
      postsData.forEach((p, index) => {
        oldToNewPostId[p.id] = newPosts[index].id;
      });
    }

    if (commentsData.length > 0) {
      const commentsToCreate = commentsData
        .map(c => {
          const newPostId = oldToNewPostId[c.postId];
          if (!newPostId) {
            return null;
          }
          
          const createdBy = c.createdBy === params.userId ? newProfile.id : c.createdBy;
          return {
            text: c.text,
            createdBy,
            postId: newPostId
          };
        })
        .filter((comment): comment is NonNullable<typeof comment> => comment !== null);
      
      if (commentsToCreate.length > 0) {
        await params.commentRepo.createComments(commentsToCreate, ctx.sharedTx);
      }
    }

    if (tagsData.length > 0) {
      const tagsByPost: Record<string, string[]> = {};
      
      // Group tags by post ID
      for (const t of tagsData as any[]) {
        const newPostId = oldToNewPostId[t.postId];
        if (!newPostId) {
          continue;
        }
        
        if (!tagsByPost[newPostId]) {
          tagsByPost[newPostId] = [];
        }
        tagsByPost[newPostId].push(t.id);
      }
      
      // Add tags to posts in bulk
      const tagOperations = Object.entries(tagsByPost).map(([postId, tagIds]) => 
        params.tagToPostRepo.addTagsToPost(postId, tagIds, ctx.sharedTx)
      );
      
      if (tagOperations.length > 0) {
        await Promise.all(tagOperations);
      }
    }

    await params.archiveRepo.deleteArchive(params.userId, ctx.sharedTx);
  });
}

