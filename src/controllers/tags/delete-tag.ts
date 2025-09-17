import { ITagRepo } from 'src/types/ITagRepo';
import { ITagToPostRepo } from 'src/types/ITagToPostRepo';

export async function deleteTag(params: {
  tagRepo: ITagRepo,
  tagToPostRepo: ITagToPostRepo,
  id: string;
}) {
  await params.tagToPostRepo.removeTagFromAllPosts(params.id);
  
  await params.tagRepo.deleteTagById(params.id);
  return { success: true };
}