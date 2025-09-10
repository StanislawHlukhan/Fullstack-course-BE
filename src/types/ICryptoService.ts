export interface ICryptoService {
  getHMAC(str: string): Promise<string>;
}