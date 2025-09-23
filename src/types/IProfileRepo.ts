import { Profile } from './Profile';

export interface IProfileRepo {
  getByEmail(email: string, tx?: unknown): Promise<Profile | null>;
  getProfileBySubId(subId: string): Promise<Profile | null>;
  createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>, tx?: unknown): Promise<Profile>;
  getProfiles(options?:{
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<{profiles: Profile[]; total: number}>
  getProfileById(id: string, tx?: unknown): Promise<Profile | null>;
  updateActivatedAt(id: string, activatedAt: Date): Promise<void>;
  updateDeletedAt(id: string, deletedAt: Date | null, tx?: unknown): Promise<void>;
  hardDeleteProfile(id: string, tx?: unknown): Promise<void>;
  getSoftDeletedProfiles(): Promise<Profile[]>;
}