import { neon } from "@neondatabase/serverless";

// Server-only client — never expose DATABASE_URL to client
export const sql = neon(process.env.DATABASE_URL!);
