import { IPostRepo } from 'src/types/IPostRepo';

export async function getPosts(params: {
  postRepo: IPostRepo;
  options: {
    limit?: number;
    page?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    commentCount?: number;
    tagIds?: string[];
  };
}) {
  const res = await params.postRepo.getPosts(params.options);
  
  const filteredPosts = res.posts
    .filter(post => post.deletedAt === null)
    .map(post => ({
      ...post,
      comments: post.comments?.filter(comment => comment.deletedAt === null)
    }));
    
     return {
    posts: filteredPosts,
    total: res.total
  };
}