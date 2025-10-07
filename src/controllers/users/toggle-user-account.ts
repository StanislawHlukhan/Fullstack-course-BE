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

  if (params.value) {
    await params.identityService.adminEnableUser(profile.subId);
  } else {
    await params.identityService.adminDisableUser(profile.subId);
  }
}
