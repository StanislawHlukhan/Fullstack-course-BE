import { IPostRepo } from 'src/types/IPostRepo';

export async function getSoftDeletedPosts(params: {
  postRepo: IPostRepo;
}) {
  const posts = await params.postRepo.getPosts({ limit: 100, page: 1 });
  const filteredPosts = posts.posts.filter(post => post.deletedAt);
  
  return { posts: filteredPosts, total: filteredPosts.length };
}