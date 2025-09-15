import { ITagRepo } from 'src/types/ITagRepo';
import { Tag } from 'src/types/Tag';

export async function createTag(params: {
  tagRepo: ITagRepo;
  data: Partial<Tag>;
}) {
  const tag = await params.tagRepo.createTag(params.data);
  return tag;
}