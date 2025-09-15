import { ITagRepo } from 'src/types/ITagRepo';
import { Tag } from 'src/types/Tag';

export async function updateTag(params: {
  tagRepo: ITagRepo;
  id: string;
  data: Partial<Tag>;
}) {
  const tag = await params.tagRepo.updateTagById(params.id, params.data);
  if (!tag) {
    throw new Error('Post not found');
  }
  return tag;
}