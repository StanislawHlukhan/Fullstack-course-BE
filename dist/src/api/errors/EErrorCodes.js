"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EErrorCodes = void 0;
exports.getErrorCodesDescription = getErrorCodesDescription;
var EErrorCodes;
(function (EErrorCodes) {
    EErrorCodes[EErrorCodes["GENERAL_ERROR"] = 1000] = "GENERAL_ERROR";
    EErrorCodes[EErrorCodes["EMAIL_USED"] = 1001] = "EMAIL_USED";
})(EErrorCodes || (exports.EErrorCodes = EErrorCodes = {}));
function getErrorCodesDescription() {
    const codes = Object.values(EErrorCodes).filter(value => typeof value === 'number');
    const names = Object.values(EErrorCodes).filter(value => typeof value !== 'number');
    return codes.map((c, i) => `- ${names[i]} -> ${c}`).join('\n');
}
