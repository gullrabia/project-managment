import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create Inngest client
export const inngest = new Inngest({ id: "create-organization" });

//  FIXED FUNCTION
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
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

      console.log(" User synced to DB");
    } catch (error) {
      console.error(" Error syncing user:", error);
      throw error; // important for Inngest retries
    }
  }
);

//Inngest Function to delete user from database


const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.deleted" }], 
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.delete({
        where: {
          id: data,id,

        }
      });

      console.log(" Deleted User synced to DB");
    } catch (error) {
      console.error(" Error syncing user:", error);
      throw error; // important for Inngest retries
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }], 
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.update({

         where: {
          id: data.id
         },
        data: {
        
          email: data?.email_addresses?.[0]?.email_address || "",
          name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
          image: data?.image_url || "",
        },
      });

      console.log("Update User synced to DB");
    } catch (error) {
      console.error(" Error syncing user:", error);
      throw error; // important for Inngest retries
    }
  }
);

// Export functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];