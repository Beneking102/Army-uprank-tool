// Types for the NC-Army Uprank Tool
export interface Rank {
  id: number;
  level: number; // 2-15
  name: string;
  pointsRequired: number;
  pointsFromPrevious: number;  
}

export interface SpecialPosition {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bonusPointsPerWeek: number;
  description?: string;
}

export interface Personnel {
  id: number;
  armyId: string; // e.g., "#A247"
  firstName: string;
  lastName: string;
  currentRankId: number;
  totalPoints: number;
  specialPositionIds: number[];
  isActive: boolean;
  joinDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointEntry {
  id: number;
  personnelId: number;
  weekStart: string; // ISO date string
  activityPoints: number; // 0-35 points
  specialPositionPoints: number; // bonus points
  totalWeekPoints: number;
  notes?: string;
  enteredBy: string;
  createdAt: Date;
}

export interface Promotion {
  id: number;
  personnelId: number;
  fromRankId: number;
  toRankId: number;
  pointsAtPromotion: number;
  promotedBy: string;
  promotionDate: Date;
  notes?: string;
}

// Extended types with relations
export interface PersonnelWithDetails extends Personnel {
  currentRank: Rank;
  specialPosition?: SpecialPosition | null;
  pointEntries?: PointEntry[];
  promotions?: Promotion[];
}

// Form types
export interface CreatePersonnelForm {
  armyId: string;
  firstName: string;
  lastName: string;
  currentRankId: number;
  specialPositionIds: number[];
  joinDate: string;
}

export interface CreatePointEntryForm {
  personnelId: number;
  weekStart: string;
  activityPoints: number;
  notes?: string;
}

export interface CreateRankForm {
  level: number;
  name: string;
  pointsRequired: number;
  pointsFromPrevious: number;
}

export interface CreateSpecialPositionForm {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bonusPointsPerWeek: number;
  description?: string;
}

// Dashboard types
export interface DashboardStats {
  totalPersonnel: number;
  activeMembers: number;
  promotionsThisWeek: number;
  averagePoints: number;
}

export interface RankDistribution {
  rank: Rank;
  count: number;
}