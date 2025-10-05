"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUser = signupUser;
const Profile_1 = require("src/types/Profile");
async function signupUser(params) {
    const identityUser = await params.identityService.createUser(params.email, params.name);
    const profile = await params.profileRepo.createProfile({
        email: params.email,
        subId: identityUser.subId,
        name: params.name,
        dickSize: params.dickSize,
        systemRole: Profile_1.ESystemRole.user
    });
    await params.identityService.setPassword(profile.subId, params.password);
    return {
        id: profile.id,
        createdAt: profile.createdAt,
        email: params.email,
        name: params.name,
        dickSize: params.dickSize
    };
}
