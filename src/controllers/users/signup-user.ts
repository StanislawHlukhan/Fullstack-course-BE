import { IIdentityService } from 'src/types/IIdentityService';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { ESystemRole } from 'src/types/Profile';

export async function signupUser(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  email: string,
  password: string,
  name: string,
  footSize: number
}) {
  const identityUser = await params.identityService.createUser(
    params.email,
    params.name
  );

  const profile = await params.profileRepo.createProfile({
    email: params.email,
    subId: identityUser.subId,
    name: params.name,
    footSize: params.footSize,
    systemRole: ESystemRole.user
  });

  await params.identityService.setPassword(profile.subId, params.password);

  return {
    id: profile.id,
    createdAt: profile.createdAt,
    email: params.email,
    name: params.name,
    footSize: params.footSize
  };
}