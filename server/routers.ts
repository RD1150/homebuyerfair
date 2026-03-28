import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createRegistration, getAllRegistrations, getRegistrationCount } from "./db";
import { notifyOwner } from "./_core/notification";

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
        // Notify owner of new registration
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
    listRegistrations: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .query(async () => {
        return getAllRegistrations();
      }),
  }),
});

export type AppRouter = typeof appRouter;
