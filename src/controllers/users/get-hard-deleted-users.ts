import { IRepos } from 'src/repos';
import { PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';
import { TagSchema } from 'src/types/Tag';

export async function getHardDeletedUsers(params: {
  repos: IRepos;
}): Promise<{ users: Array<{
  id: string;
  email: string;
  name: string;
  dickSize: number;
  createdAt: Date;
  isEnabled?: boolean;
  activatedAt?: Date | null;
  deletedAt?: Date | null;
  posts?: Array<ReturnType<typeof PostSchema.parse> & {
    tags?: ReturnType<typeof TagSchema.parse>[];
    comments?: ReturnType<typeof CommentSchema.parse>[];
  }>;
}>; total: number }> {
  const archives = await params.repos.archiveRepo.getArchivedUsers();

  const users = archives.map(a => {
    const u: any = a.userData || {};
    const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
    const activatedAt = u.activatedAt ? new Date(u.activatedAt) : null;
    const deletedAt = a.createdAt ? new Date(a.createdAt) : null;
    // CODE REVIEW: старайся уникати мап в мапі. Спробуй знайти інший спосіб зробити це без мапів. 
    const postsRaw = (a.postsData as any[] || []).map(p => PostSchema.parse({
      ...p,
      createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      deletedAt: p.deletedAt ? new Date(p.deletedAt) : null
    }));

    const commentsRaw = (a.commentsData as any[] || []).map(c => CommentSchema.parse({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      deletedAt: c.deletedAt ? new Date(c.deletedAt) : null
    }));

    const tagsRaw = (a.tagsData as any[] || []).map(t => TagSchema.parse({
      id: t.id,
      name: t.name,
      createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date()
    }));

    const postIdToTags = new Map<string, ReturnType<typeof TagSchema.parse>[]>();
    for (const t of (a.tagsData as any[] || [])) {
      const list = postIdToTags.get(t.postId) || [];
      const tag = tagsRaw.find(x => x.id === t.id);
      if (tag) { list.push(tag); }
      postIdToTags.set(t.postId, list);
    }

    const postIdToComments = new Map<string, ReturnType<typeof CommentSchema.parse>[]>();
    for (const c of commentsRaw) {
      const list = postIdToComments.get(c.postId) || [];
      list.push(c);
      postIdToComments.set(c.postId, list);
    }

    const posts = postsRaw.map(p => ({
      ...p,
      tags: postIdToTags.get(p.id) || [],
      comments: postIdToComments.get(p.id) || []
    }));

    return {
      id: u.id || a.archivedUserId,
      email: u.email,
      name: u.name,
      dickSize: u.dickSize,
      createdAt,
      isEnabled: false,
      activatedAt,
      deletedAt,
      posts
    };
  });
  
  return { users, total: users.length };
}

