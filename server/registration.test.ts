import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createRegistration: vi.fn().mockResolvedValue({ insertId: 1 }),
  getAllRegistrations: vi.fn().mockResolvedValue([
    {
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "8055550123",
      adultsCount: 2,
      childrenCount: 1,
      notes: null,
      createdAt: new Date("2026-03-01T10:00:00Z"),
    },
  ]),
  getRegistrationCount: vi.fn().mockResolvedValue(1),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const validRegistration = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phone: "8055550123",
  adultsCount: 2,
  childrenCount: 1,
};

describe("registration.submit", () => {
  it("accepts a valid registration and returns success", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.registration.submit(validRegistration);
    expect(result).toEqual({ success: true });
  });

  it("rejects registration with missing first name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.registration.submit({ ...validRegistration, firstName: "" })
    ).rejects.toThrow();
  });

  it("rejects registration with invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.registration.submit({ ...validRegistration, email: "not-an-email" })
    ).rejects.toThrow();
  });

  it("rejects registration with zero adults", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.registration.submit({ ...validRegistration, adultsCount: 0 })
    ).rejects.toThrow();
  });
});

describe("registration.count", () => {
  it("returns registration count for public users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.registration.count();
    expect(result).toHaveProperty("count");
    expect(typeof result.count).toBe("number");
  });
});

describe("admin.listRegistrations", () => {
  it("allows admin to list registrations", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.listRegistrations();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("firstName");
    expect(result[0]).toHaveProperty("email");
  });

  it("denies non-admin user access to registrations", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.listRegistrations()).rejects.toThrow("Admin access required");
  });

  it("denies unauthenticated access to registrations", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.listRegistrations()).rejects.toThrow();
  });
});
