import { ITransactionManager } from 'src/types/ITransaction';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { IPostRepo } from 'src/types/IPostRepo';
import { ICommentRepo } from 'src/types/ICommentRepo';
import { IArchiveRepo } from 'src/types/IArchiveRepo';
import { ITagToPostRepo } from 'src/types/ITagToPostRepo';

export async function hardDeleteUser(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  archiveRepo: IArchiveRepo;
  tagToPostRepo: ITagToPostRepo;
  transactionManager: ITransactionManager;
  userId: string;
}) {
  return await params.transactionManager.execute(async (ctx) => {
    const user = await params.profileRepo.getProfileById(params.userId, ctx.sharedTx);
    if (!user) {
      throw new Error('User not found');
    }

    const posts = await params.postRepo.getPostsByUserId(params.userId, ctx.sharedTx);
    const postIds = posts.map(p => p.id);

    const tagsData = await params.tagToPostRepo.getTagsByPostIds(postIds, ctx.sharedTx);

    const commentsByUser = await params.commentRepo.getCommentsByUserId(params.userId, ctx.sharedTx);
    const commentsUnderUserPosts = await params.commentRepo.getCommentsByPostIds(postIds, ctx.sharedTx);

    await params.archiveRepo.createArchive({
      archivedUserId: params.userId,
      userData: user,
      postsData: posts,
      commentsData: [...commentsByUser, ...commentsUnderUserPosts],
      tagsData,
      tx: ctx.sharedTx
    });

    // Delete tag associations first
    await params.tagToPostRepo.deleteTagsByPostIds(postIds, ctx.sharedTx);
    
    // Delete comments under user's posts (comments by other users on this user's posts)
    await params.commentRepo.hardDeleteCommentsByPostIds(postIds, ctx.sharedTx);
    
    // Delete comments created by user (comments this user made on any posts)
    await params.commentRepo.hardDeleteComment(params.userId, ctx.sharedTx);
    
    // Delete posts
    await params.postRepo.hardDeletePost(params.userId, ctx.sharedTx);
    
    // Delete user profile
    await params.profileRepo.hardDeleteProfile(params.userId, ctx.sharedTx);
  });
}

