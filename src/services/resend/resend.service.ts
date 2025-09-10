import { Resend } from 'resend';
import { IMailService } from 'src/types/IMailService';
import { ApplicationError } from 'src/types/errors/ApplicationError';

export function getResendService(): IMailService {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return {
    async send(from: string, to: string, subject: string, html?: string, vars?: Record<string, string>) {
      try {
        const { data, error } = await resend.emails.send({
          from,
          to,
          subject,
          html: '<strong>It works!</strong>'
        });

      } catch (error) {
        throw new ApplicationError('Failed to send email', error);
      }
    }
    
  };
}

function generateEmailHtml(vars: Record<string, string>): string {
  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${vars.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px;">${vars.subject}</h2>
        <div style="background-color: white; padding: 20px; border-radius: 5px;">
          ${generateContentFromVars(vars)}
        </div>
        <a href="${vars.url}">${vars.url}</a>
      </div>
    </body>
    </html>
  `;

  return baseTemplate;
}

function generateContentFromVars(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    .join('');
}
