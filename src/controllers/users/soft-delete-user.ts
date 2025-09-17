import { IProfileRepo } from 'src/types/IProfileRepo';

export async function softDeleteUser(params: {
  profileRepo: IProfileRepo,
  id: string
}) {
  const profile = await params.profileRepo.getProfileById(params.id);
  if (profile?.deletedAt) {
    throw new Error('Profile already deleted');
  }

  await params.profileRepo.updateDeletedAt(params.id, new Date());
}