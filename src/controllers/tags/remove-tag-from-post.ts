import { IPostRepo } from 'src/types/IPostRepo';
import { ITagRepo } from 'src/types/ITagRepo';

export async function removeTagFromPost(params: {
  postRepo: IPostRepo;
  tagRepo: ITagRepo;
  postId: string;
  tagIds: string[];
}) {
  await params.postRepo.removeTagsFromPost(params.postId, params.tagIds);
}