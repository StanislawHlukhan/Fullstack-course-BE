"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailService = getMailService;
const mail_1 = __importDefault(require("@sendgrid/mail"));
function getMailService(apiKey) {
    mail_1.default.setApiKey(apiKey);
    return {
        send: async (to, from, templateId, vars) => {
            await mail_1.default.send({
                to,
                from,
                templateId,
                dynamicTemplateData: vars
            });
        }
    };
}
