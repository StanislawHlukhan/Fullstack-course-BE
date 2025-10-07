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
      dickSize: userData.dickSize,
      subId: userData.subId,
      systemRole: userData.systemRole,
      activatedAt: activatedAtRaw ? new Date(activatedAtRaw) : null,
      deletedAt: null
    }, ctx.sharedTx);

    const oldToNewPostId: Record<string, string> = {};

    // Restore posts
    if (postsData.length > 0) {
      // CODE REVIEW: Уникай виконання запитів в базу в циклах, особливо в транзакції. 
      // Для того щоб створити пости усі за один раз, треба зробити bulk insert.
      for (const p of postsData) {
        const newPost = await params.postRepo.createPost({
          title: p.title,
          description: p.description,
          createdBy: newProfile.id
        }, ctx.sharedTx);
        oldToNewPostId[p.id] = newPost.id;
      }
    }

    if (commentsData.length > 0) {
      // CODE REVIEW: The same
      for (const c of commentsData) {
        const newPostId = oldToNewPostId[c.postId];
        if (!newPostId) {
          continue;
        }
        
        try {
          await params.postRepo.getPostById(newPostId, ctx.sharedTx);
        } catch (_error) {
          continue;
        }
        
        const createdBy = c.createdBy === params.userId ? newProfile.id : c.createdBy;
        await params.commentRepo.createComment({
          text: c.text,
          createdBy
        }, newPostId, ctx.sharedTx);
      }
    }

    if (tagsData.length > 0) {
      // CODE REVIEW: The same
      const tagsByPost: Record<string, string[]> = {};
      for (const t of tagsData as any[]) {
        const newPostId = oldToNewPostId[t.postId];
        if (!newPostId) {
          continue;
        }
        
        try {
          await params.postRepo.getPostById(newPostId, ctx.sharedTx);
        } catch (_error) {
          continue;
        }
        
        if (!tagsByPost[newPostId]) {
          tagsByPost[newPostId] = [];
        }
        tagsByPost[newPostId].push(t.id);
      }
      
      // CODE REVIEW: The same
      for (const [postId, tagIds] of Object.entries(tagsByPost)) {
        await params.tagToPostRepo.addTagsToPost(postId, tagIds, ctx.sharedTx);
      }
    }

    await params.archiveRepo.deleteArchive(params.userId, ctx.sharedTx);
  });
}

