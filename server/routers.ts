import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createRegistration, getAllRegistrations, getRegistrationCount } from "./db";
import { notifyOwner } from "./_core/notification";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_COOKIE = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "changeme";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-key-change-in-production");

async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(JWT_SECRET);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

const registrationInput = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email is required").max(320),
  phone: z.string().min(7, "Phone number is required").max(30),
  adultsCount: z.number().int().min(1, "At least 1 adult required").max(20),
  childrenCount: z.number().int().min(0).max(20),
  notes: z.string().max(500).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  registration: router({
    submit: publicProcedure
      .input(registrationInput)
      .mutation(async ({ input }) => {
        await createRegistration(input);
        await notifyOwner({
          title: "New Event Registration",
          content: `${input.firstName} ${input.lastName} just registered for the Homebuyer Extravaganza! Party of ${input.adultsCount} adult(s) and ${input.childrenCount} child(ren). Email: ${input.email}`,
        }).catch(() => {/* non-blocking */});
        return { success: true };
      }),

    count: publicProcedure.query(async () => {
      const count = await getRegistrationCount();
      return { count };
    }),
  }),

  admin: router({
    // Check if current request has a valid admin session cookie
    checkSession: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.[ADMIN_COOKIE];
      if (!token) return { authenticated: false };
      const valid = await verifyAdminToken(token);
      return { authenticated: valid };
    }),

    // Login with password
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect password" });
        }
        const token = await signAdminToken();
        const isSecure = ctx.req.protocol === "https" || ctx.req.headers["x-forwarded-proto"] === "https";
        ctx.res.cookie(ADMIN_COOKIE, token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
          maxAge: 12 * 60 * 60 * 1000, // 12 hours
          path: "/",
        });
        return { success: true };
      }),

    // Logout
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE, { path: "/" });
      return { success: true };
    }),

    // List all registrations (requires valid admin cookie)
    listRegistrations: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.[ADMIN_COOKIE];
      if (!token || !(await verifyAdminToken(token))) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin authentication required" });
      }
      return getAllRegistrations();
    }),
  }),
});

export type AppRouter = typeof appRouter;
