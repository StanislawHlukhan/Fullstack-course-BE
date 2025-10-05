"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoftDeletedUsers = getSoftDeletedUsers;
async function getSoftDeletedUsers(params) {
    const profiles = await params.profileRepo.getSoftDeletedProfiles();
    const users = await params.identityService.getUsers(profiles.map(p => p.subId));
    const userMap = new Map(users.map(u => [u.subId, u]));
    const result = profiles.map(profile => {
        const user = userMap.get(profile.subId);
        return {
            id: profile.id,
            createdAt: profile.createdAt,
            email: profile.email,
            name: profile.name,
            isEnabled: user.isEnabled,
            dickSize: profile.dickSize,
            activatedAt: profile.activatedAt,
            deletedAt: profile.deletedAt
        };
    });
    if (!result.length) {
        throw new Error('No soft deleted users found');
    }
    return { users: result, total: result.length };
}
