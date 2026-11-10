import { z } from "zod";

// Bump when Terms, Privacy Policy or cookie use changes materially: re-prompts everyone.
export const POLICY_VERSION = "2026-11-10";

export const CONSENT_COOKIE = "cookie_consent";
export const ANON_COOKIE = "anon_id";

export const ConsentRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("cookies"),
    choice: z.enum(["all", "essential"]),
    anonId: z.string().uuid(),
  }),
  // Literal true: server refuses a sign-in record unless all three boxes were ticked.
  z.object({
    type: z.literal("auth"),
    terms: z.literal(true),
    privacy: z.literal(true),
    age18: z.literal(true),
    anonId: z.string().uuid().optional(),
  }),
]);

export type ConsentRequest = z.infer<typeof ConsentRequestSchema>;
