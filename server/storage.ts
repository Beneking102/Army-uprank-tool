import {
  adminUsers,
  ranks,
  specialPositions,
  personnel,
  pointEntries,
  promotions,
  type AdminUser,
  type InsertAdminUser,
  type Rank,
  type InsertRank,
  type SpecialPosition,
  type InsertSpecialPosition,
  type Personnel,
  type InsertPersonnel,
  type PersonnelWithDetails,
  type PointEntry,
  type InsertPointEntry,
  type Promotion,
  type InsertPromotion,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sum, count } from "drizzle-orm";

export interface IStorage {
  // Admin user operations
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUserLastLogin(id: number): Promise<void>;
  
  // Rank operations
  getRanks(): Promise<Rank[]>;
  getRankById(id: number): Promise<Rank | undefined>;
  createRank(rank: InsertRank): Promise<Rank>;
  
  // Special position operations
  getSpecialPositions(): Promise<SpecialPosition[]>;
  getSpecialPositionById(id: number): Promise<SpecialPosition | undefined>;
  createSpecialPosition(position: InsertSpecialPosition): Promise<SpecialPosition>;
  
  // Personnel operations
  getPersonnel(): Promise<PersonnelWithDetails[]>;
  getPersonnelById(id: number): Promise<PersonnelWithDetails | undefined>;
  getPersonnelByArmyId(armyId: string): Promise<PersonnelWithDetails | undefined>;
  createPersonnel(personnel: InsertPersonnel): Promise<Personnel>;
  updatePersonnel(id: number, updates: Partial<Personnel>): Promise<Personnel>;
  
  // Point entry operations
  getPointEntries(personnelId?: number): Promise<PointEntry[]>;
  createPointEntry(entry: InsertPointEntry): Promise<PointEntry>;
  getWeeklyPoints(personnelId: number, weekStart: string): Promise<PointEntry | undefined>;
  
  // Promotion operations
  getPromotions(personnelId?: number): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalPersonnel: number;
    activeMembers: number;
    promotionsThisWeek: number;
    averagePoints: number;
  }>;
  
  // Rank distribution
  getRankDistribution(): Promise<{ rank: Rank; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // Admin user operations
  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(userData).returning();
    return user;
  }

  async updateAdminUserLastLogin(id: number): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id));
  }

  // Rank operations
  async getRanks(): Promise<Rank[]> {
    return await db.select().from(ranks).orderBy(ranks.level);
  }

  async getRankById(id: number): Promise<Rank | undefined> {
    const [rank] = await db.select().from(ranks).where(eq(ranks.id, id));
    return rank;
  }

  async createRank(rank: InsertRank): Promise<Rank> {
    const [newRank] = await db.insert(ranks).values(rank).returning();
    return newRank;
  }

  // Special position operations
  async getSpecialPositions(): Promise<SpecialPosition[]> {
    return await db.select().from(specialPositions).orderBy(specialPositions.name);
  }

  async getSpecialPositionById(id: number): Promise<SpecialPosition | undefined> {
    const [position] = await db.select().from(specialPositions).where(eq(specialPositions.id, id));
    return position;
  }

  async createSpecialPosition(position: InsertSpecialPosition): Promise<SpecialPosition> {
    const [newPosition] = await db.insert(specialPositions).values(position).returning();
    return newPosition;
  }

  // Personnel operations
  async getPersonnel(): Promise<PersonnelWithDetails[]> {
    return await db
      .select({
        id: personnel.id,
        armyId: personnel.armyId,
        firstName: personnel.firstName,
        lastName: personnel.lastName,
        currentRankId: personnel.currentRankId,
        totalPoints: personnel.totalPoints,
        specialPositionId: personnel.specialPositionId,
        isActive: personnel.isActive,
        joinDate: personnel.joinDate,
        createdAt: personnel.createdAt,
        updatedAt: personnel.updatedAt,
        currentRank: ranks,
        specialPosition: specialPositions,
      })
      .from(personnel)
      .leftJoin(ranks, eq(personnel.currentRankId, ranks.id))
      .leftJoin(specialPositions, eq(personnel.specialPositionId, specialPositions.id))
      .orderBy(personnel.lastName, personnel.firstName) as any;
  }

  async getPersonnelById(id: number): Promise<PersonnelWithDetails | undefined> {
    const [person] = await db
      .select({
        id: personnel.id,
        armyId: personnel.armyId,
        firstName: personnel.firstName,
        lastName: personnel.lastName,
        currentRankId: personnel.currentRankId,
        totalPoints: personnel.totalPoints,
        specialPositionId: personnel.specialPositionId,
        isActive: personnel.isActive,
        joinDate: personnel.joinDate,
        createdAt: personnel.createdAt,
        updatedAt: personnel.updatedAt,
        currentRank: ranks,
        specialPosition: specialPositions,
      })
      .from(personnel)
      .leftJoin(ranks, eq(personnel.currentRankId, ranks.id))
      .leftJoin(specialPositions, eq(personnel.specialPositionId, specialPositions.id))
      .where(eq(personnel.id, id)) as any;
    return person;
  }

  async getPersonnelByArmyId(armyId: string): Promise<PersonnelWithDetails | undefined> {
    const [person] = await db
      .select({
        id: personnel.id,
        armyId: personnel.armyId,
        firstName: personnel.firstName,
        lastName: personnel.lastName,
        currentRankId: personnel.currentRankId,
        totalPoints: personnel.totalPoints,
        specialPositionId: personnel.specialPositionId,
        isActive: personnel.isActive,
        joinDate: personnel.joinDate,
        createdAt: personnel.createdAt,
        updatedAt: personnel.updatedAt,
        currentRank: ranks,
        specialPosition: specialPositions,
      })
      .from(personnel)
      .leftJoin(ranks, eq(personnel.currentRankId, ranks.id))
      .leftJoin(specialPositions, eq(personnel.specialPositionId, specialPositions.id))
      .where(eq(personnel.armyId, armyId)) as any;
    return person;
  }

  async createPersonnel(personnelData: InsertPersonnel): Promise<Personnel> {
    const [newPersonnel] = await db.insert(personnel).values(personnelData).returning();
    return newPersonnel;
  }

  async updatePersonnel(id: number, updates: Partial<Personnel>): Promise<Personnel> {
    const [updatedPersonnel] = await db
      .update(personnel)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(personnel.id, id))
      .returning();
    return updatedPersonnel;
  }

  // Point entry operations
  async getPointEntries(personnelId?: number): Promise<PointEntry[]> {
    const query = db.select().from(pointEntries).orderBy(desc(pointEntries.weekStart));
    
    if (personnelId) {
      return await query.where(eq(pointEntries.personnelId, personnelId));
    }
    
    return await query;
  }

  async createPointEntry(entry: InsertPointEntry): Promise<PointEntry> {
    const totalWeekPoints = (entry.activityPoints || 0) + (entry.specialPositionPoints || 0);
    const [newEntry] = await db
      .insert(pointEntries)
      .values({ ...entry, totalWeekPoints })
      .returning();
    
    // Update personnel total points by recalculating from all entries
    const pointSum = await db
      .select({ total: sum(pointEntries.totalWeekPoints) })
      .from(pointEntries)
      .where(eq(pointEntries.personnelId, entry.personnelId));
    
    await db
      .update(personnel)
      .set({
        totalPoints: Number(pointSum[0]?.total || 0),
        updatedAt: new Date(),
      })
      .where(eq(personnel.id, entry.personnelId));
    
    return newEntry;
  }

  async getWeeklyPoints(personnelId: number, weekStart: string): Promise<PointEntry | undefined> {
    const [entry] = await db
      .select()
      .from(pointEntries)
      .where(and(
        eq(pointEntries.personnelId, personnelId),
        eq(pointEntries.weekStart, weekStart)
      ));
    return entry;
  }

  // Promotion operations
  async getPromotions(personnelId?: number): Promise<Promotion[]> {
    const query = db.select().from(promotions).orderBy(desc(promotions.promotionDate));
    
    if (personnelId) {
      return await query.where(eq(promotions.personnelId, personnelId));
    }
    
    return await query;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [newPromotion] = await db.insert(promotions).values(promotion).returning();
    
    // Update personnel rank
    await db
      .update(personnel)
      .set({
        currentRankId: promotion.toRankId,
        updatedAt: new Date(),
      })
      .where(eq(personnel.id, promotion.personnelId));
    
    return newPromotion;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalPersonnel: number;
    activeMembers: number;
    promotionsThisWeek: number;
    averagePoints: number;
  }> {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
    
    const [totalResult] = await db.select({ count: count() }).from(personnel);
    const [activeResult] = await db.select({ count: count() }).from(personnel).where(eq(personnel.isActive, true));
    const [promotionsResult] = await db.select({ count: count() }).from(promotions).where(gte(promotions.promotionDate, weekStart));
    const [avgResult] = await db.select({ avg: sum(personnel.totalPoints) }).from(personnel).where(eq(personnel.isActive, true));
    
    const totalPersonnel = totalResult.count;
    const activeMembers = activeResult.count;
    const averagePoints = activeMembers > 0 ? Math.round(Number(avgResult.avg || 0) / activeMembers) : 0;
    
    return {
      totalPersonnel,
      activeMembers,
      promotionsThisWeek: promotionsResult.count,
      averagePoints,
    };
  }

  // Rank distribution
  async getRankDistribution(): Promise<{ rank: Rank; count: number }[]> {
    const result = await db
      .select({
        rank: ranks,
        count: count(personnel.id),
      })
      .from(ranks)
      .leftJoin(personnel, eq(ranks.id, personnel.currentRankId))
      .groupBy(ranks.id)
      .orderBy(ranks.level);
    
    return result;
  }
}

export const storage = new DatabaseStorage();
