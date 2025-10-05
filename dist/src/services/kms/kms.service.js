"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAWSKMSService = getAWSKMSService;
const client_kms_1 = require("@aws-sdk/client-kms");
function getAWSKMSService(region, keyId) {
    const client = new client_kms_1.KMSClient({ region });
    return {
        async getHMAC(str) {
            const input = {
                Message: Buffer.from(str, 'utf-8'),
                KeyId: keyId,
                MacAlgorithm: 'HMAC_SHA_512'
            };
            const command = new client_kms_1.GenerateMacCommand(input);
            const response = await client.send(command);
            return Buffer.from(response.Mac).toString('base64url');
        }
    };
}
