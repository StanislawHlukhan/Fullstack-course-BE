import { ITagRepo } from 'src/types/ITagRepo';

export async function deleteTag(params: {
  tagRepo: ITagRepo,
  id: string;
}) {
  await params.tagRepo.deleteTagById(params.id);
  return { success: true };
}