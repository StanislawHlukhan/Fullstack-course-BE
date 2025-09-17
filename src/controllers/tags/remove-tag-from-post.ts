import { ITagToPostRepo } from 'src/types/ITagToPostRepo';

export async function removeTagFromPost(params: {
  tagToPostRepo: ITagToPostRepo;
  postId: string;
  tagIds: string[];
}) {
  await params.tagToPostRepo.removeTagsFromPost(params.postId, params.tagIds);
}