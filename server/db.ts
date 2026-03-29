// Database helpers removed — registrations are handled via Google Forms/Sheets.
// This file is kept as a typed stub so sdk.ts and other imports compile without errors.
import type { User, InsertUser } from "../drizzle/schema";

export async function upsertUser(_user: Partial<InsertUser>): Promise<void> {
  // No-op: Manus OAuth user sync not used on Render
}

export async function getUserByOpenId(_openId: string): Promise<User | undefined> {
  // No-op: returns undefined, auth falls back gracefully in context.ts
  return undefined;
}
