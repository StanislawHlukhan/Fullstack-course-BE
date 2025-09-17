 import { ITagToPostRepo } from 'src/types/ITagToPostRepo';

export async function addTagToPost(params: {
  tagToPostRepo: ITagToPostRepo;
  postId: string;
  tagIds: string[];
}) {
  const existingTags = await params.tagToPostRepo.getTagsByPostId(params.postId);

  const newTagIds = params.tagIds.filter(tagId => !existingTags.some(tag => tag.id === tagId));

  if (newTagIds.length > 0) {
    await params.tagToPostRepo.addTagsToPost(params.postId, newTagIds);
  }
}