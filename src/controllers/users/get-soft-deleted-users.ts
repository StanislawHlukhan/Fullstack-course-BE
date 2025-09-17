import { IProfileRepo } from 'src/types/IProfileRepo';
import { IIdentityService } from 'src/types/IIdentityService';

export async function getSoftDeletedUsers(params: {
  profileRepo: IProfileRepo;
  identityService: IIdentityService;
}) {
  const { profiles } = await params.profileRepo.getProfiles({
    limit: 100,
    page: 1
  });

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
      dickSize: profile.dickSize,
      activatedAt: profile.activatedAt,
      deletedAt: profile.deletedAt
      };
  });

  const softDeletedUsers = result.filter(user => user.deletedAt);
  if(!softDeletedUsers.length) {
    throw new Error('No soft deleted users found');
  }
  return { users: softDeletedUsers, total: softDeletedUsers.length };
}