import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Army-specific utilities
export function getRankCategory(level: number): string {
  if (level >= 2 && level <= 5) return 'Mannschaft';
  if (level >= 6 && level <= 10) return 'Unteroffiziere';
  if (level >= 11 && level <= 15) return 'Offiziere';
  return 'Unbekannt';
}

export function getRankCategoryClass(level: number): string {
  if (level >= 2 && level <= 5) return 'rank-mannschaft';
  if (level >= 6 && level <= 10) return 'rank-unteroffiziere';
  if (level >= 11 && level <= 15) return 'rank-offiziere';
  return '';
}

export function getDifficultyClass(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'difficulty-easy';
    case 'medium': return 'difficulty-medium';
    case 'hard': return 'difficulty-hard';
    default: return '';
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'Einfach';
    case 'medium': return 'Mittel';
    case 'hard': return 'Schwer';
    default: return difficulty;
  }
}

// Points calculation
export function canPromoteToNextRank(currentPoints: number, currentRank: { pointsRequired: number }, nextRank?: { pointsRequired: number }): boolean {
  if (!nextRank) return false;
  return currentPoints >= nextRank.pointsRequired;
}

export function getProgressToNextRank(currentPoints: number, currentRank: { pointsRequired: number }, nextRank?: { pointsRequired: number }): number {
  if (!nextRank) return 100;
  const pointsNeeded = nextRank.pointsRequired - currentRank.pointsRequired;
  const pointsEarned = Math.max(0, currentPoints - currentRank.pointsRequired);
  return Math.min(100, (pointsEarned / pointsNeeded) * 100);
}