// export interface IMailService {
//   send(from: string, to: string, subject: string, html?: string, vars?: Record<string, string>): Promise<void>;
// }
export interface IMailService {
  send(to: string, from: string, templateId: string, vars?: Record<string, string>): Promise<void>;
}