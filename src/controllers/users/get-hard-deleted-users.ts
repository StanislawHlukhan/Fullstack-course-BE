import { IRepos } from 'src/repos';
import { PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';
import { TagSchema } from 'src/types/Tag';

export async function getHardDeletedUsers(params: {
  repos: IRepos;
}): Promise<{
  users: Array<{
    id: string;
    email: string;
    name: string;
    dickSize: number;
    createdAt: Date;
    isEnabled?: boolean;
    activatedAt?: Date | null;
    deletedAt?: Date | null;
    posts?: Array<
      ReturnType<typeof PostSchema.parse> & {
        tags?: ReturnType<typeof TagSchema.parse>[];
        comments?: ReturnType<typeof CommentSchema.parse>[];
      }
    >;
  }>;
  total: number;
}> {
  const archives = await params.repos.archiveRepo.getArchivedUsers();

  const users = archives.map(a => {
    const u: any = a.userData || {};
    const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
    const activatedAt = u.activatedAt ? new Date(u.activatedAt) : null;
    const deletedAt = a.createdAt ? new Date(a.createdAt) : null;

    const postsData = (a.postsData as any[]) || [];
    const commentsData = (a.commentsData as any[]) || [];
    const tagsData = (a.tagsData as any[]) || [];

    const commentsByPost: Record<string, ReturnType<typeof CommentSchema.parse>[]> = {};
    for (const c of commentsData) {
      const parsed = CommentSchema.parse({
        ...c,
        createdAt: new Date(c.createdAt ?? Date.now()),
        updatedAt: new Date(c.updatedAt ?? Date.now()),
        deletedAt: c.deletedAt ? new Date(c.deletedAt) : null
      });
      (commentsByPost[c.postId] ||= []).push(parsed);
    }

    const tagsByPost: Record<string, ReturnType<typeof TagSchema.parse>[]> = {};
    for (const t of tagsData) {
      const parsed = TagSchema.parse({
        id: t.id,
        name: t.name,
        createdAt: new Date(t.createdAt ?? Date.now()),
        updatedAt: new Date(t.updatedAt ?? Date.now())
      });
      (tagsByPost[t.postId] ||= []).push(parsed);
    }

    const posts = postsData.map(p =>
      PostSchema.parse({
        ...p,
        createdAt: new Date(p.createdAt ?? Date.now()),
        updatedAt: new Date(p.updatedAt ?? Date.now()),
        deletedAt: p.deletedAt ? new Date(p.deletedAt) : null,
        tags: tagsByPost[p.id] || [],
        comments: commentsByPost[p.id] || []
      })
    );

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
