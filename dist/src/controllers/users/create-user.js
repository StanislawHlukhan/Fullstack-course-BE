"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
const Profile_1 = require("src/types/Profile");
async function createUser(params) {
    const identityUser = await params.identityService.createUser(params.email, params.name);
    const profile = await params.profileRepo.createProfile({
        email: params.email,
        subId: identityUser.subId,
        name: params.name,
        dickSize: params.dickSize,
        systemRole: Profile_1.ESystemRole.user
    });
    return profile;
}
