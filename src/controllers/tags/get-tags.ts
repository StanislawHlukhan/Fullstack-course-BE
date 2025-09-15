import { ITagRepo } from 'src/types/ITagRepo';

export async function getTags(params: {
  tagRepo: ITagRepo;
}) {
  const tags = await params.tagRepo.getTags();
  return tags;
}