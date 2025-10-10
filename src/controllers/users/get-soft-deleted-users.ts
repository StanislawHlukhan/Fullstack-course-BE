import { IProfileRepo } from 'src/types/IProfileRepo';
import { IIdentityService } from 'src/types/IIdentityService';

export async function getSoftDeletedUsers(params: {
  profileRepo: IProfileRepo;
  identityService: IIdentityService;
}) {
  const profiles = await params.profileRepo.getSoftDeletedProfiles();

  const users = await params.identityService.getUsers(profiles.map(p => p.subId));

  const userMap = new Map(users.map(u => [u.subId, u]));

  const result = profiles.map(profile => {
    const user = userMap.get(profile.subId)!;

    return {
      id: profile.id,
      createdAt: profile.createdAt,
      email: profile.email!,
      name: profile.name,
      isEnabled: user.isEnabled,
      footSize: profile.footSize,
      activatedAt: profile.activatedAt,
      deletedAt: profile.deletedAt
      };
  });

  return { users: result, total: result.length };
}