import { IRepos } from 'src/repos';

export async function hardRestoreUser(params: {
  repos: IRepos;
  userId: string;
}) {
  const { repos, userId } = params;
  await repos.archiveRepo.restoreUserFromArchive(userId);
}

