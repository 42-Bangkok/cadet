import { rdb } from "../db/rdb";

/**
 * Wrapper for the 42 API
 */
export class FtApi {
  BASE_URL: string;
  AUTH_42_SCHOOL_ID: string;
  AUTH_42_SCHOOL_SECRET: string;
  /**
   * Instrumentation ensures AUTH_42_SCHOOL_ID, AUTH_42_SCHOOL_SECRET exist
   */
  constructor() {
    this.BASE_URL = "https://api.intra.42.fr";
    this.AUTH_42_SCHOOL_ID = process.env.AUTH_42_SCHOOL_ID!;
    this.AUTH_42_SCHOOL_SECRET = process.env.AUTH_42_SCHOOL_SECRET!;
  }
  /**
   * Fetches an access token from the 42 API
   * @see https://api.intra.42.fr/apidoc/guides/getting_started
   */
  async authorize(): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    created_at: number;
    secret_valid_until: number;
  }> {
    const r = await fetch(`${this.BASE_URL}/oauth/token`, {
      next: { revalidate: false },
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${this.AUTH_42_SCHOOL_ID}&client_secret=${this.AUTH_42_SCHOOL_SECRET}`,
    });
    if (!r.ok) {
      throw new Error("Failed to get access token");
    }
    return await r.json();
  }

  /**
   * Returns an access token from the 42 API
   * @see https://api.intra.42.fr/apidoc/guides/getting_started
   */
  async getAccessToken(): Promise<string> {
    const accessToken = await rdb.get("FtApi:access_token");
    if (accessToken) {
      return accessToken;
    }
    const token = await this.authorize();
    await rdb.set(
      "FtApi:access_token",
      token.access_token,
      "EX",
      token.expires_in - 60
    );
    return token.access_token;
  }

  /**
   * Get a user by their ID
   * @param id - The user's ID numerical or login
   */
  async getUserById({ id }: { id: string }): Promise<any> {
    const r = await fetch(`${this.BASE_URL}/v2/users/${id}`, {
      next: { revalidate: 3600 },
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });
    if (!r.ok) {
      console.error(r.statusText);
      throw new Error("Failed to get user");
    }
    return await r.json();
  }

  /**
   * Get a user's image by their ID
   * @param id - The user's ID numerical or login
   */
  async getUserImageById({ id }: { id: string }): Promise<string> {
    const user = await this.getUserById({ id });
    return user.image.link;
  }
}

// const ftApi = new FtApi();
// const image = await ftApi.getUserById({ id: "lpumidol" });
// console.log(image);
