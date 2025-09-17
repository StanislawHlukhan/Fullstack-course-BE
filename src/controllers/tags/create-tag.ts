import { ITagRepo } from 'src/types/ITagRepo';
import { Tag } from 'src/types/Tag';

export async function createTag(params: {
  tagRepo: ITagRepo;
  data: Partial<Tag>;
}) {
  const tag = await params.tagRepo.getTagByName(params.data.name!);
  if (tag.length > 0) {
    throw new Error('Tag already exists');
  }
  const newTag = await params.tagRepo.createTag(params.data);
  return newTag;
}