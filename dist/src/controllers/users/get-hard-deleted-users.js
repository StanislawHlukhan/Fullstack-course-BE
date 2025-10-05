"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHardDeletedUsers = getHardDeletedUsers;
const Post_1 = require("src/types/Post");
const Comment_1 = require("src/types/Comment");
const Tag_1 = require("src/types/Tag");
async function getHardDeletedUsers(params) {
    const archives = await params.repos.archiveRepo.getArchivedUsers();
    const users = archives.map(a => {
        const u = a.userData || {};
        const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
        const activatedAt = u.activatedAt ? new Date(u.activatedAt) : null;
        const deletedAt = a.createdAt ? new Date(a.createdAt) : null;
        const postsRaw = (a.postsData || []).map(p => Post_1.PostSchema.parse({
            ...p,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            deletedAt: p.deletedAt ? new Date(p.deletedAt) : null
        }));
        const commentsRaw = (a.commentsData || []).map(c => Comment_1.CommentSchema.parse({
            ...c,
            createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
            updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
            deletedAt: c.deletedAt ? new Date(c.deletedAt) : null
        }));
        const tagsRaw = (a.tagsData || []).map(t => Tag_1.TagSchema.parse({
            id: t.id,
            name: t.name,
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date()
        }));
        const postIdToTags = new Map();
        for (const t of (a.tagsData || [])) {
            const list = postIdToTags.get(t.postId) || [];
            const tag = tagsRaw.find(x => x.id === t.id);
            if (tag) {
                list.push(tag);
            }
            postIdToTags.set(t.postId, list);
        }
        const postIdToComments = new Map();
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
