import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { commentTable, postTable } from 'src/services/drizzle/schema';
import { IPostRepo } from 'src/types/IPostRepo';
import { Post, PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';
import { eq } from 'drizzle-orm';

export const getPostRepo = (db: NodePgDatabase): IPostRepo => {
  return{
    async getPosts(){
      const postsWithComments = await db.select({
        post: postTable,
        comment: commentTable
      })
      .from(postTable)
      .leftJoin(commentTable, eq(postTable.id, commentTable.postId));

      const postsMap = new Map<string, Post>();
      
      for (const row of postsWithComments) {
        const postId = row.post.id;
        
        if (!postsMap.has(postId)) {
          postsMap.set(postId, PostSchema.parse({
            ...row.post,
            comments: []
          }));
        }
        
        if (row.comment) {
          const comment = CommentSchema.parse(row.comment);
          const post = postsMap.get(postId)!;
          post.comments!.push(comment);
        }
      }
      
      return Array.from(postsMap.values());
    },

    async createPost(postData){
      const post = await db.insert(postTable).values(postData as Post).returning();
      return PostSchema.parse(post[0]);
    },

    async getPostById(id){
      const postWithComments = await db.select({
        post: postTable,
        comment: commentTable
      })
      .from(postTable)
      .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
      .where(eq(postTable.id, id));

      if (postWithComments.length === 0) {
        throw new Error('Post not found');
      }

      const post = PostSchema.parse({
        ...postWithComments[0].post,
        comments: postWithComments
          .filter(row => row.comment)
          .map(row => CommentSchema.parse(row.comment))
      });

      return post;
    },

    async updatePostById(id, postData){
      const posts = await db
      .update(postTable)
      .set(postData)
      .where(eq(postTable.id, id))
      .returning();
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    }
  };
};