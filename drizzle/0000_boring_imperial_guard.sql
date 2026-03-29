CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"adultsCount" integer DEFAULT 1 NOT NULL,
	"childrenCount" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
