import { IPostRepo } from 'src/types/IPostRepo';

export async function getPostsByProfileId(params: {
  postRepo: IPostRepo;
  profileId: string;
}) {
  const res = await params.postRepo.getPostsByProfileId(params.profileId);

  return res;
}