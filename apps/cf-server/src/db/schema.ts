import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { desc, sql } from "drizzle-orm";

export const contactUs = sqliteTable("contactus", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  email: text("email").notNull(),

  subject: text("subject").notNull(), // or remove `.notNull()` if optional

  description: text("description").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
}); 