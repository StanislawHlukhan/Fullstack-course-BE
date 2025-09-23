import { Archive } from './Archive';

export interface IArchiveRepo {
  createArchive(data: Partial<Archive & { tx?: unknown }>): Promise<Archive>;
  getArchiveForUser(userId: string): Promise<Archive | null>;
  getArchivedUsers(): Promise<Archive[]>;
  deleteArchive(userId: string, tx?: unknown): Promise<void>;
}