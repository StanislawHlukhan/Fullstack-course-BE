import { ITagRepo } from 'src/types/ITagRepo';
import { IPostRepo } from 'src/types/IPostRepo';

export async function addTagToPost(params: {
  postRepo: IPostRepo;
  tagRepo: ITagRepo;
  postId: string;
  tagIds: string[];
}) {
  await params.postRepo.addTagsToPost(params.postId, params.tagIds);
}