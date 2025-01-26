interface ICreateLinkCode {
  discordId: number;
  linkCode: string;
  expiresAt: Date;
}
/**
 * insert a new link code into the database
 */
export const insertLinkCode = async (p: ICreateLinkCode) => {};
