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
  };
}) {
  const result = await params.postRepo.getPosts(params.options);
  return result;
}