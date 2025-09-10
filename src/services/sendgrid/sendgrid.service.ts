import sgMail from '@sendgrid/mail';
import { IMailService } from 'src/types/IMailService';

export function getMailService(apiKey: string): IMailService {
  sgMail.setApiKey(apiKey);
  return {
    send: async (to: string, from: string, templateId: string, vars: Record<string, string>) => {
      await sgMail.send({
        to,
        from,
        templateId,
        dynamicTemplateData: vars
      });
    }
  };
}