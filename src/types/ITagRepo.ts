import { Tag } from './Tag';

export interface ITagRepo {
  getTags(): Promise<Tag[]>;
  createTag(tag: Partial<Tag>): Promise<Tag>;
  updateTagById(id: string, tag: Partial<Tag>): Promise<Tag | null>;
  deleteTagById(id: string): Promise<void>;
}