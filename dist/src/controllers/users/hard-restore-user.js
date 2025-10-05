"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardRestoreUser = hardRestoreUser;
async function hardRestoreUser(params) {
    return await params.transactionManager.execute(async (ctx) => {
        const archive = await params.archiveRepo.getArchiveForUser(params.userId);
        if (!archive) {
            throw new Error('Archive not found for user');
        }
        const userData = archive.userData;
        const postsData = archive.postsData || [];
        const commentsData = archive.commentsData || [];
        const tagsData = archive.tagsData || [];
        // Restore profile
        const activatedAtRaw = (userData.activatedAt ?? null);
        const newProfile = await params.profileRepo.createProfile({
            name: userData.name,
            email: userData.email,
            dickSize: userData.dickSize,
            subId: userData.subId,
            systemRole: userData.systemRole,
            activatedAt: activatedAtRaw ? new Date(activatedAtRaw) : null,
            deletedAt: null
        }, ctx.sharedTx);
        const oldToNewPostId = {};
        // Restore posts
        if (postsData.length > 0) {
            for (const p of postsData) {
                const newPost = await params.postRepo.createPost({
                    title: p.title,
                    description: p.description,
                    createdBy: newProfile.id
                }, ctx.sharedTx);
                oldToNewPostId[p.id] = newPost.id;
            }
        }
        if (commentsData.length > 0) {
            for (const c of commentsData) {
                const newPostId = oldToNewPostId[c.postId];
                if (!newPostId) {
                    continue;
                }
                try {
                    await params.postRepo.getPostById(newPostId, ctx.sharedTx);
                }
                catch (_error) {
                    continue;
                }
                const createdBy = c.createdBy === params.userId ? newProfile.id : c.createdBy;
                await params.commentRepo.createComment({
                    text: c.text,
                    createdBy
                }, newPostId, ctx.sharedTx);
            }
        }
        if (tagsData.length > 0) {
            const tagsByPost = {};
            for (const t of tagsData) {
                const newPostId = oldToNewPostId[t.postId];
                if (!newPostId) {
                    continue;
                }
                try {
                    await params.postRepo.getPostById(newPostId, ctx.sharedTx);
                }
                catch (_error) {
                    continue;
                }
                if (!tagsByPost[newPostId]) {
                    tagsByPost[newPostId] = [];
                }
                tagsByPost[newPostId].push(t.id);
            }
            for (const [postId, tagIds] of Object.entries(tagsByPost)) {
                await params.tagToPostRepo.addTagsToPost(postId, tagIds, ctx.sharedTx);
            }
        }
        await params.archiveRepo.deleteArchive(params.userId, ctx.sharedTx);
    });
}
