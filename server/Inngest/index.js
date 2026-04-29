import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Inngest client
export const inngest = new Inngest({ id: "create-organization" });

/* ---------------- CREATE USER ---------------- */
const syncUserCreation = inngest.createFunction(
  {
    id: "clerk-user-created", //  UNIQUE
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.create({
        data: {
          id: data.id,
          email: data?.email_addresses?.[0]?.email_address || "",
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url || "",
        },
      });

      console.log(" User created in DB");
    } catch (error) {
      console.error(" Create error:", error);
      throw error;
    }
  }
);

/* ---------------- DELETE USER ---------------- */
const syncUserDeletion = inngest.createFunction(
  {
    id: "clerk-user-deleted", //  UNIQUE
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.delete({
        where: {
          id: data.id, //  FIXED TYPO
        },
      });

      console.log(" User deleted from DB");
    } catch (error) {
      console.error(" Delete error:", error);
      throw error;
    }
  }
);

/* ---------------- UPDATE USER ---------------- */
const syncUserUpdation = inngest.createFunction(
  {
    id: "clerk-user-updated", //  UNIQUE
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          email: data?.email_addresses?.[0]?.email_address || "",
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url || "",
        },
      });

      console.log(" User updated in DB");
    } catch (error) {
      console.error(" Update error:", error);
      throw error;
    }
  }
);

/* ---------------- EXPORT ---------------- */
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];