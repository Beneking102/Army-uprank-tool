import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Army ranks table
export const ranks = pgTable("ranks", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull().unique(), // 2-15
  name: varchar("name", { length: 100 }).notNull(),
  pointsRequired: integer("points_required").notNull(), // Total points needed for this rank
  pointsFromPrevious: integer("points_from_previous").notNull(), // Points needed from previous rank
});

// Special positions table
export const specialPositions = pgTable("special_positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'easy', 'medium', 'hard'
  bonusPointsPerWeek: integer("bonus_points_per_week").notNull(),
  description: text("description"),
});

// Personnel table - Army members  
export const personnel = pgTable("personnel", {
  id: serial("id").primaryKey(),
  armyId: varchar("army_id", { length: 20 }).notNull().unique(), // e.g., "#A247"
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  currentRankId: integer("current_rank_id").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  specialPositionId: integer("special_position_id"), // Keep single position for now, can be extended later
  isActive: boolean("is_active").notNull().default(true),
  joinDate: date("join_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Weekly point entries table
export const pointEntries = pgTable("point_entries", {
  id: serial("id").primaryKey(),
  personnelId: integer("personnel_id").notNull(),
  weekStart: date("week_start").notNull(), // Start of the week (Sunday for German week structure)
  activityPoints: integer("activity_points").notNull().default(0), // 0-35 points for activities
  specialPositionPoints: integer("special_position_points").notNull().default(0), // Auto-calculated bonus points
  totalWeekPoints: integer("total_week_points").notNull(), // activityPoints + specialPositionPoints
  notes: text("notes"),
  enteredBy: varchar("entered_by").notNull(), // User ID who entered the points
  createdAt: timestamp("created_at").defaultNow(),
});

// Promotion history table
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  personnelId: integer("personnel_id").notNull(),
  fromRankId: integer("from_rank_id").notNull(),
  toRankId: integer("to_rank_id").notNull(),
  pointsAtPromotion: integer("points_at_promotion").notNull(),
  promotedBy: varchar("promoted_by").notNull(), // User ID who approved promotion
  promotionDate: timestamp("promotion_date").defaultNow(),
  notes: text("notes"),
});

// Relations
export const personnelRelations = relations(personnel, ({ one, many }) => ({
  currentRank: one(ranks, {
    fields: [personnel.currentRankId],
    references: [ranks.id],
  }),
  specialPosition: one(specialPositions, {
    fields: [personnel.specialPositionId],
    references: [specialPositions.id],
  }),
  pointEntries: many(pointEntries),
  promotions: many(promotions),
}));

export const ranksRelations = relations(ranks, ({ many }) => ({
  personnel: many(personnel),
}));

export const specialPositionsRelations = relations(specialPositions, ({ many }) => ({
  personnel: many(personnel),
}));

export const pointEntriesRelations = relations(pointEntries, ({ one }) => ({
  personnel: one(personnel, {
    fields: [pointEntries.personnelId],
    references: [personnel.id],
  }),
}));

export const promotionsRelations = relations(promotions, ({ one }) => ({
  personnel: one(personnel, {
    fields: [promotions.personnelId],
    references: [personnel.id],
  }),
  fromRank: one(ranks, {
    fields: [promotions.fromRankId],
    references: [ranks.id],
  }),
  toRank: one(ranks, {
    fields: [promotions.toRankId],
    references: [ranks.id],
  }),
}));

// Insert schemas
export const insertRankSchema = createInsertSchema(ranks).omit({
  id: true,
});

export const insertSpecialPositionSchema = createInsertSchema(specialPositions).omit({
  id: true,
});

export const insertPersonnelSchema = createInsertSchema(personnel).omit({
  id: true,
  totalPoints: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPointEntrySchema = createInsertSchema(pointEntries).omit({
  id: true,
  totalWeekPoints: true,
  createdAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  promotionDate: true,
});

// Insert schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Rank = typeof ranks.$inferSelect;
export type InsertRank = z.infer<typeof insertRankSchema>;
export type SpecialPosition = typeof specialPositions.$inferSelect;
export type InsertSpecialPosition = z.infer<typeof insertSpecialPositionSchema>;
export type Personnel = typeof personnel.$inferSelect;
export type InsertPersonnel = z.infer<typeof insertPersonnelSchema>;
export type PointEntry = typeof pointEntries.$inferSelect;
export type InsertPointEntry = z.infer<typeof insertPointEntrySchema>;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;

// Extended types with relations
export type PersonnelWithDetails = Personnel & {
  currentRank: Rank;
  specialPosition?: SpecialPosition | null;
  pointEntries?: PointEntry[];
  promotions?: Promotion[];
};
