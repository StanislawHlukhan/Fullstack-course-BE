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