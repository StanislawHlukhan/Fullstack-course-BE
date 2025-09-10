import { ICryptoService } from 'src/types/ICryptoService';
import { IIdentityService } from 'src/types/IIdentityService';
import { IProfileRepo } from 'src/types/IProfileRepo';

export async function acceptInvite(params: {
  userId: string
  password: string
  email: string
  signature: string,
  expireAtMs: number,
  cryptoService: ICryptoService
  profileRepo: IProfileRepo
  identityService: IIdentityService
}) {
  const hmacStr = `${params.email}${params.userId}${params.expireAtMs}`;

  const signatureToCheck = await params.cryptoService.getHMAC(hmacStr);
  if (signatureToCheck !== params.signature) {
    throw new Error('Invalid signature');
  }
  const profile = await params.profileRepo.getProfileById(params.userId);

  if (!profile) {
    throw new Error('Profile not found');
  }

  await params.identityService.setPassword(profile.subId, params.password);
  await params.profileRepo.updateActivatedAt(profile.id, new Date());

}