import { Profile } from './Profile';

export interface IProfileRepo {
  getProfileBySubId(subId: string): Promise<Profile | null>;
  createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>, tx?: unknown): Promise<Profile>;
  getProfiles(options?:{
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<{profiles: Profile[]; total: number}>
  getProfileById(id: string, tx?: unknown): Promise<Profile | null>;

}