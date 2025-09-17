import { IRepos } from 'src/repos';

export async function hardDeleteUser(params: {
  repos: IRepos;
  userId: string;
}) {
  const { repos, userId } = params;
  await repos.archiveRepo.archiveAndHardDeleteUser(userId);
}

