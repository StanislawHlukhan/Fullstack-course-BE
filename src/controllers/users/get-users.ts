import { IIdentityService } from 'src/types/IIdentityService';
import { IProfileRepo } from 'src/types/IProfileRepo';

export async function getUsers(params: {
  profileRepo: IProfileRepo;
  identityService: IIdentityService;
  limit?: number;
  page?: number;
  search?: string;
}) {
  const { profiles, total } = await params.profileRepo.getProfiles({
    limit: params.limit,
    page: params.page,
    search: params.search
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
  return { users: result, total };
}