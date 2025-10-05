"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAWSCognitoService = getAWSCognitoService;
const ApplicationError_1 = require("src/types/errors/ApplicationError");
const AWS = __importStar(require("@aws-sdk/client-cognito-identity-provider"));
const IdentityUser_1 = require("src/types/IdentityUser");
const HttpError_1 = require("src/api/errors/HttpError");
const EErrorCodes_1 = require("src/api/errors/EErrorCodes");
function getAWSCognitoService(region) {
    const client = new AWS.CognitoIdentityProvider({
        region
    });
    return {
        async toggleUserAccount(subId, value) {
            try {
                if (value) {
                    await client.adminEnableUser({
                        UserPoolId: process.env.AWS_USER_POOL_ID,
                        Username: subId
                    });
                }
                else {
                    await client.adminDisableUser({
                        UserPoolId: process.env.AWS_USER_POOL_ID,
                        Username: subId
                    });
                }
            }
            catch (err) {
                throw new ApplicationError_1.ApplicationError(`Cognito error - ${err}`);
            }
        },
        // list users in cognito have required pagination 
        async getUsers(subIds) {
            try {
                const users = await Promise.all(subIds.map(async (subId) => {
                    const user = await client.adminGetUser({
                        UserPoolId: process.env.AWS_USER_POOL_ID,
                        Username: subId
                    });
                    const attributesMap = user.UserAttributes?.reduce((map, attr) => {
                        if (attr.Name && attr.Value !== undefined) {
                            map[attr.Name] = attr.Value;
                        }
                        return map;
                    }, {}) || {};
                    return IdentityUser_1.IdentityUserSchema.parse({
                        subId: user.Username,
                        email: attributesMap.email || '',
                        name: attributesMap.name || '',
                        emailVerified: attributesMap.email_verified === 'true',
                        isEnabled: user.Enabled
                    });
                }));
                return users;
            }
            catch (err) {
                throw new ApplicationError_1.ApplicationError(`Cognito error - ${err}`);
            }
        },
        async getUserByAccessToken(token) {
            try {
                const user = await client.getUser({
                    AccessToken: token
                });
                const rawUserData = user.UserAttributes?.reduce((acc, attribute) => {
                    if (attribute.Name) {
                        return { ...acc, [attribute.Name]: attribute.Value || null };
                    }
                    return acc;
                }, {});
                return IdentityUser_1.IdentityUserSchema.parse({
                    subId: rawUserData.sub,
                    email: rawUserData.email
                });
            }
            catch (err) {
                throw new ApplicationError_1.ApplicationError(`Cognito error - ${err}`);
            }
        },
        async createUser(email, name) {
            try {
                const result = await client.adminCreateUser({
                    Username: email,
                    UserAttributes: [
                        { Name: 'email', Value: email },
                        { Name: 'name', Value: name },
                        { Name: 'email_verified', Value: 'true' }
                    ],
                    UserPoolId: process.env.AWS_USER_POOL_ID,
                    MessageAction: 'SUPPRESS'
                });
                const att = result.User?.Attributes?.find(a => a.Name === 'sub');
                return { subId: att?.Value, email };
            }
            catch (err) {
                if (err instanceof AWS.UsernameExistsException) {
                    throw new HttpError_1.HttpError(400, 'Cognito error', err, EErrorCodes_1.EErrorCodes.EMAIL_USED);
                }
                throw new ApplicationError_1.ApplicationError(`Cognito error - ${err}`);
            }
        },
        async setPassword(subId, password) {
            try {
                await client.adminSetUserPassword({
                    UserPoolId: process.env.AWS_USER_POOL_ID,
                    Username: subId,
                    Password: password,
                    Permanent: true
                });
            }
            catch (err) {
                throw new ApplicationError_1.ApplicationError(`Cognito error - ${err}`);
            }
        }
    };
}
