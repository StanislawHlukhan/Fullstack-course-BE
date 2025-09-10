import { KMSClient, GenerateMacCommand, MacAlgorithmSpec } from '@aws-sdk/client-kms';
import { ICryptoService } from 'src/types/ICryptoService';

export function getAWSKMSService(region: string, keyId: string): ICryptoService {
  const client = new KMSClient({ region });
  return {
    async getHMAC(str: string): Promise<string> {
      const input = {
        Message: Buffer.from(str, 'utf-8'),
        KeyId: keyId,
        MacAlgorithm: 'HMAC_SHA_512' as MacAlgorithmSpec
      };
      const command = new GenerateMacCommand(input);
      const response = await client.send(command);
      return Buffer.from(response.Mac!).toString('base64url');
    }
  };
}