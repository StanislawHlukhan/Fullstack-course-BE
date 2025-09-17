import { Archive } from './Archive';

export interface IArchiveRepo {
  createArchive(data: Partial<Archive & { tx?: unknown }>): Promise<Archive>;
  getArchiveForUser(userId: string): Promise<Archive | null>;
  getArchivedUsers(): Promise<Archive[]>;
  restoreUserFromArchive(userId: string): Promise<void>;
  archiveAndHardDeleteUser(userId: string): Promise<void>;
}