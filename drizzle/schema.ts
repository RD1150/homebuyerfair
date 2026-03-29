import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  adultsCount: integer("adultsCount").notNull().default(1),
  childrenCount: integer("childrenCount").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;
