// Mock data for the NC-Army Uprank Tool Demo
import type { 
  Rank, 
  SpecialPosition, 
  Personnel, 
  PointEntry, 
  Promotion,
  PersonnelWithDetails 
} from '../types';

// Mock ranks data (level 2-15)
export const mockRanks: Rank[] = [
  { id: 1, level: 2, name: 'Schütze', pointsRequired: 0, pointsFromPrevious: 0 },
  { id: 2, level: 3, name: 'Gefreiter', pointsRequired: 50, pointsFromPrevious: 50 },
  { id: 3, level: 4, name: 'Obergefreiter', pointsRequired: 120, pointsFromPrevious: 70 },
  { id: 4, level: 5, name: 'Hauptgefreiter', pointsRequired: 220, pointsFromPrevious: 100 },
  { id: 5, level: 6, name: 'Stabsgefreiter', pointsRequired: 350, pointsFromPrevious: 130 },
  { id: 6, level: 7, name: 'Unteroffizier', pointsRequired: 510, pointsFromPrevious: 160 },
  { id: 7, level: 8, name: 'Stabsunteroffizier', pointsRequired: 700, pointsFromPrevious: 190 },
  { id: 8, level: 9, name: 'Feldwebel', pointsRequired: 920, pointsFromPrevious: 220 },
  { id: 9, level: 10, name: 'Oberfeldwebel', pointsRequired: 1170, pointsFromPrevious: 250 },
  { id: 10, level: 11, name: 'Hauptfeldwebel', pointsRequired: 1450, pointsFromPrevious: 280 },
  { id: 11, level: 12, name: 'Leutnant', pointsRequired: 1760, pointsFromPrevious: 310 },
  { id: 12, level: 13, name: 'Oberleutnant', pointsRequired: 2100, pointsFromPrevious: 340 },
  { id: 13, level: 14, name: 'Hauptmann', pointsRequired: 2470, pointsFromPrevious: 370 },
  { id: 14, level: 15, name: 'Oberst', pointsRequired: 2870, pointsFromPrevious: 400 },
];

// Mock special positions
export const mockSpecialPositions: SpecialPosition[] = [
  {
    id: 1,
    name: 'Drillsergeant',
    difficulty: 'medium',
    bonusPointsPerWeek: 5,
    description: 'Verantwortlich für die Ausbildung neuer Rekruten'
  },
  {
    id: 2,
    name: 'Sanitäter',
    difficulty: 'hard',
    bonusPointsPerWeek: 8,
    description: 'Medizinische Versorgung im Feld'
  },
  {
    id: 3,
    name: 'Ausbilder',
    difficulty: 'easy',
    bonusPointsPerWeek: 3,
    description: 'Schulung von Soldaten in verschiedenen Bereichen'
  },
  {
    id: 4,
    name: 'Scharfschütze',
    difficulty: 'hard',
    bonusPointsPerWeek: 10,
    description: 'Spezialist für Präzisionsschüsse'
  },
  {
    id: 5,
    name: 'Logistik',
    difficulty: 'medium',
    bonusPointsPerWeek: 6,
    description: 'Verwaltung von Ausrüstung und Nachschub'
  }
];

// Mock personnel data
export const mockPersonnel: PersonnelWithDetails[] = [
  {
    id: 1,
    armyId: '#A001',
    firstName: 'Max',
    lastName: 'Mueller',
    currentRankId: 8,
    totalPoints: 920,
    specialPositionIds: [1],
    isActive: true,
    joinDate: '2024-01-15',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-20'),
    currentRank: mockRanks[7], // Feldwebel
    specialPosition: mockSpecialPositions[0] // Drillsergeant
  },
  {
    id: 2,
    armyId: '#A002',
    firstName: 'Anna',
    lastName: 'Schmidt',
    currentRankId: 6,
    totalPoints: 510,
    specialPositionIds: [2],
    isActive: true,
    joinDate: '2024-03-01',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-01-18'),
    currentRank: mockRanks[5], // Unteroffizier
    specialPosition: mockSpecialPositions[1] // Sanitäter
  },
  {
    id: 3,
    armyId: '#A003',
    firstName: 'Thomas',
    lastName: 'Weber',
    currentRankId: 12,
    totalPoints: 2100,
    specialPositionIds: [4],
    isActive: true,
    joinDate: '2023-06-10',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2025-01-22'),
    currentRank: mockRanks[11], // Oberleutnant
    specialPosition: mockSpecialPositions[3] // Scharfschütze
  },
  {
    id: 4,
    armyId: '#A004',
    firstName: 'Lisa',
    lastName: 'Fischer',
    currentRankId: 4,
    totalPoints: 220,
    specialPositionIds: [3],
    isActive: true,
    joinDate: '2024-08-20',
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2025-01-15'),
    currentRank: mockRanks[3], // Hauptgefreiter
    specialPosition: mockSpecialPositions[2] // Ausbilder
  },
  {
    id: 5,
    armyId: '#A005',
    firstName: 'Michael',
    lastName: 'Wagner',
    currentRankId: 10,
    totalPoints: 1450,
    specialPositionIds: [5],
    isActive: true,
    joinDate: '2023-11-12',
    createdAt: new Date('2023-11-12'),
    updatedAt: new Date('2025-01-19'),
    currentRank: mockRanks[9], // Hauptfeldwebel
    specialPosition: mockSpecialPositions[4] // Logistik
  }
];

// Mock point entries
export const mockPointEntries: PointEntry[] = [
  {
    id: 1,
    personnelId: 1,
    weekStart: '2025-01-13',
    activityPoints: 28,
    specialPositionPoints: 5,
    totalWeekPoints: 33,
    notes: 'Gute Leistung in der Woche',
    enteredBy: 'admin',
    createdAt: new Date('2025-01-20')
  },
  {
    id: 2,
    personnelId: 2,
    weekStart: '2025-01-13',
    activityPoints: 25,
    specialPositionPoints: 8,
    totalWeekPoints: 33,
    notes: 'Medizinische Übungen erfolgreich',
    enteredBy: 'admin',
    createdAt: new Date('2025-01-19')
  },
  {
    id: 3,
    personnelId: 3,
    weekStart: '2025-01-13',
    activityPoints: 32,
    specialPositionPoints: 10,
    totalWeekPoints: 42,
    notes: 'Ausgezeichnete Schießleistung',
    enteredBy: 'admin',
    createdAt: new Date('2025-01-22')
  }
];

// Mock promotions
export const mockPromotions: Promotion[] = [
  {
    id: 1,
    personnelId: 1,
    fromRankId: 7,
    toRankId: 8,
    pointsAtPromotion: 920,
    promotedBy: 'admin',
    promotionDate: new Date('2025-01-15'),
    notes: 'Beförderung aufgrund hervorragender Leistungen'
  },
  {
    id: 2,
    personnelId: 3,
    fromRankId: 11,
    toRankId: 12,
    pointsAtPromotion: 2100,
    promotedBy: 'admin',
    promotionDate: new Date('2025-01-10'),
    notes: 'Führungsqualitäten bewiesen'
  }
];

// Dashboard statistics
export const mockDashboardStats = {
  totalPersonnel: mockPersonnel.length,
  activeMembers: mockPersonnel.filter(p => p.isActive).length,
  promotionsThisWeek: 2,
  averagePoints: Math.round(mockPersonnel.reduce((sum, p) => sum + p.totalPoints, 0) / mockPersonnel.length)
};

// Rank distribution
export const mockRankDistribution = mockRanks.map(rank => ({
  rank,
  count: mockPersonnel.filter(p => p.currentRankId === rank.id).length
})).filter(item => item.count > 0);