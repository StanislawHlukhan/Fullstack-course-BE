import { IIdentityService } from 'src/types/IIdentityService';
import { IProfileRepo } from 'src/types/IProfileRepo';

export async function toggleUserAccount(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  id: string,
  value: boolean
}) {
  const profile = await params.profileRepo.getProfileById(params.id);
  if (!profile) {
    throw new Error('Profile not found');
  }

  await params.identityService.toggleUserAccount(profile.subId, params.value);
}
