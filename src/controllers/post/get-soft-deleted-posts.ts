import { IPostRepo } from 'src/types/IPostRepo';

export async function getSoftDeletedPosts(params: {
  postRepo: IPostRepo;
}) {
  const posts = await params.postRepo.getSoftDeletedPosts();
    
  return { posts, total: posts.length };
}