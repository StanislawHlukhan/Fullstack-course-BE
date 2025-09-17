import { IProfileRepo } from 'src/types/IProfileRepo';

export async function softRestoreUser(params: {
  profileRepo: IProfileRepo,
  id: string
}) {
  const profile = await params.profileRepo.getProfileById(params.id);
  if (!profile) {
    throw new Error('Profile not found');
  }

  if (!profile.deletedAt) {
    throw new Error('Profile is not deleted');
  }

  await params.profileRepo.updateDeletedAt(params.id, null);
}