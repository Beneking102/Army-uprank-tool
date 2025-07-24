// Mock API service for demo functionality
import {
  mockRanks,
  mockSpecialPositions,
  mockPersonnel,
  mockPointEntries,
  mockPromotions,
  mockDashboardStats,
  mockRankDistribution
} from '../data/mockData';
import type {
  Rank,
  SpecialPosition,
  PersonnelWithDetails,
  PointEntry,
  Promotion,
  DashboardStats,
  RankDistribution,
  CreatePersonnelForm,
  CreatePointEntryForm,
  CreateRankForm,
  CreateSpecialPositionForm
} from '../types';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export class MockApiService {
  // Ranks
  static async getRanks(): Promise<Rank[]> {
    await delay();
    return mockRanks;
  }

  static async getRankById(id: number): Promise<Rank | undefined> {
    await delay();
    return mockRanks.find(rank => rank.id === id);
  }

  static async createRank(rankData: CreateRankForm): Promise<Rank> {
    await delay();
    const newRank: Rank = {
      id: Math.max(...mockRanks.map(r => r.id)) + 1,
      ...rankData
    };
    mockRanks.push(newRank);
    return newRank;
  }

  // Special Positions
  static async getSpecialPositions(): Promise<SpecialPosition[]> {
    await delay();
    return mockSpecialPositions;
  }

  static async getSpecialPositionById(id: number): Promise<SpecialPosition | undefined> {
    await delay();
    return mockSpecialPositions.find(pos => pos.id === id);
  }

  static async createSpecialPosition(posData: CreateSpecialPositionForm): Promise<SpecialPosition> {
    await delay();
    const newPosition: SpecialPosition = {
      id: Math.max(...mockSpecialPositions.map(p => p.id)) + 1,
      ...posData
    };
    mockSpecialPositions.push(newPosition);
    return newPosition;
  }

  // Personnel
  static async getPersonnel(): Promise<PersonnelWithDetails[]> {
    await delay();
    return mockPersonnel;
  }

  static async getPersonnelById(id: number): Promise<PersonnelWithDetails | undefined> {
    await delay();
    return mockPersonnel.find(person => person.id === id);
  }

  static async createPersonnel(personnelData: CreatePersonnelForm): Promise<PersonnelWithDetails> {
    await delay();
    const currentRank = mockRanks.find(r => r.id === personnelData.currentRankId);
    const specialPosition = personnelData.specialPositionIds.length > 0 
      ? mockSpecialPositions.find(sp => sp.id === personnelData.specialPositionIds[0])
      : undefined;

    const newPersonnel: PersonnelWithDetails = {
      id: Math.max(...mockPersonnel.map(p => p.id)) + 1,
      ...personnelData,
      totalPoints: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentRank: currentRank!,
      specialPosition: specialPosition || null
    };
    
    mockPersonnel.push(newPersonnel);
    return newPersonnel;
  }

  // Point Entries
  static async getPointEntries(personnelId?: number): Promise<PointEntry[]> {
    await delay();
    if (personnelId) {
      return mockPointEntries.filter(entry => entry.personnelId === personnelId);
    }
    return mockPointEntries;
  }

  static async createPointEntry(entryData: CreatePointEntryForm): Promise<PointEntry> {
    await delay();
    
    // Find personnel and their special position
    const personnel = mockPersonnel.find(p => p.id === entryData.personnelId);
    const specialPosition = personnel?.specialPosition;
    const bonusPoints = specialPosition?.bonusPointsPerWeek || 0;

    const newEntry: PointEntry = {
      id: Math.max(...mockPointEntries.map(e => e.id)) + 1,
      ...entryData,
      specialPositionPoints: bonusPoints,
      totalWeekPoints: entryData.activityPoints + bonusPoints,
      enteredBy: 'demo-user',
      createdAt: new Date()
    };

    mockPointEntries.push(newEntry);

    // Update personnel total points
    if (personnel) {
      personnel.totalPoints += newEntry.totalWeekPoints;
      personnel.updatedAt = new Date();
    }

    return newEntry;
  }

  // Promotions
  static async getPromotions(personnelId?: number): Promise<Promotion[]> {
    await delay();
    if (personnelId) {
      return mockPromotions.filter(promo => promo.personnelId === personnelId);
    }
    return mockPromotions;
  }

  static async promotePersonnel(personnelId: number, toRankId: number, notes?: string): Promise<Promotion> {
    await delay();
    
    const personnel = mockPersonnel.find(p => p.id === personnelId);
    if (!personnel) {
      throw new Error('Personnel not found');
    }

    const promotion: Promotion = {
      id: Math.max(...mockPromotions.map(p => p.id)) + 1,
      personnelId,
      fromRankId: personnel.currentRankId,
      toRankId,
      pointsAtPromotion: personnel.totalPoints,
      promotedBy: 'demo-user',
      promotionDate: new Date(),
      notes
    };

    mockPromotions.push(promotion);

    // Update personnel rank
    personnel.currentRankId = toRankId;
    personnel.currentRank = mockRanks.find(r => r.id === toRankId)!;
    personnel.updatedAt = new Date();

    return promotion;
  }

  // Dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    // Recalculate stats dynamically
    const stats = {
      totalPersonnel: mockPersonnel.length,
      activeMembers: mockPersonnel.filter(p => p.isActive).length,
      promotionsThisWeek: mockPromotions.filter(p => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return p.promotionDate >= oneWeekAgo;
      }).length,
      averagePoints: Math.round(
        mockPersonnel.reduce((sum, p) => sum + p.totalPoints, 0) / mockPersonnel.length
      )
    };
    return stats;
  }

  static async getRankDistribution(): Promise<RankDistribution[]> {
    await delay();
    return mockRanks.map(rank => ({
      rank,
      count: mockPersonnel.filter(p => p.currentRankId === rank.id).length
    })).filter(item => item.count > 0);
  }
}