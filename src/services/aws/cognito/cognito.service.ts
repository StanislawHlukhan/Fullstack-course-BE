import { IIdentityService } from 'src/types/IIdentityService';
import { ApplicationError } from 'src/types/errors/ApplicationError';
import * as AWS from '@aws-sdk/client-cognito-identity-provider';
import { IdentityUserSchema } from 'src/types/IdentityUser';
import { HttpError } from 'src/api/errors/HttpError';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';

export function getAWSCognitoService(region: string): IIdentityService {
  const client = new AWS.CognitoIdentityProvider({
    region
  });

  return {
    async toggleUserAccount(subId, value) {
      try {
        // CODE REVIEW: в тебе має бути 2 окремі методи для adminEnableUser та adminDisableUser.
        // якщо обʼєднати їх в один, то вже це бізнес логіка, а вона має бути в контролері а не в сервісі.
        if (value) {
          await client.adminEnableUser({
            UserPoolId: process.env.AWS_USER_POOL_ID,
            Username: subId
          });
        } else {
          await client.adminDisableUser({
            UserPoolId: process.env.AWS_USER_POOL_ID,
            Username: subId
          });
        }
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
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

          const attributesMap = user.UserAttributes?.reduce<Record<string, string>>((map, attr) => {
            if (attr.Name && attr.Value !== undefined) {
              map[attr.Name] = attr.Value;
            }
            return map;
          }, {}) || {};

          return IdentityUserSchema.parse({
            subId: user.Username!,
            email: attributesMap.email || '',
            name: attributesMap.name || '',
            emailVerified: attributesMap.email_verified === 'true',
            isEnabled: user.Enabled
          });
        }));

        return users;
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },
    async getUserByAccessToken(token) {
      try {
        const user = await client.getUser({
          AccessToken: token
        });

        const rawUserData = user.UserAttributes?.reduce<Record<string, string | null>>((acc, attribute) => {
          if (attribute.Name) {
            return { ...acc, [attribute.Name]: attribute.Value || null };
          }

          return acc;
        }, {});

        return IdentityUserSchema.parse({
          subId: rawUserData!.sub,
          email: rawUserData!.email
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
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
        return { subId: att?.Value as string, email };
      } catch (err) {
        if (err instanceof AWS.UsernameExistsException) {
          throw new HttpError(400, 'Cognito error', err, EErrorCodes.EMAIL_USED);
        }

        throw new ApplicationError(`Cognito error - ${err}`);
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
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    }
  };
}