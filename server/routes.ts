import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPersonnelSchema, insertPointEntrySchema, insertPromotionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/rank-distribution', isAuthenticated, async (req, res) => {
    try {
      const distribution = await storage.getRankDistribution();
      res.json(distribution);
    } catch (error) {
      console.error("Error fetching rank distribution:", error);
      res.status(500).json({ message: "Failed to fetch rank distribution" });
    }
  });

  // Personnel routes
  app.get('/api/personnel', isAuthenticated, async (req, res) => {
    try {
      const personnel = await storage.getPersonnel();
      res.json(personnel);
    } catch (error) {
      console.error("Error fetching personnel:", error);
      res.status(500).json({ message: "Failed to fetch personnel" });
    }
  });

  app.get('/api/personnel/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getPersonnelById(id);
      if (!person) {
        return res.status(404).json({ message: "Personnel not found" });
      }
      res.json(person);
    } catch (error) {
      console.error("Error fetching personnel:", error);
      res.status(500).json({ message: "Failed to fetch personnel" });
    }
  });

  app.post('/api/personnel', isAuthenticated, async (req: any, res) => {
    try {
      const validation = insertPersonnelSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      const personnel = await storage.createPersonnel(validation.data);
      res.status(201).json(personnel);
    } catch (error) {
      console.error("Error creating personnel:", error);
      res.status(500).json({ message: "Failed to create personnel" });
    }
  });

  app.patch('/api/personnel/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const personnel = await storage.updatePersonnel(id, updates);
      res.json(personnel);
    } catch (error) {
      console.error("Error updating personnel:", error);
      res.status(500).json({ message: "Failed to update personnel" });
    }
  });

  // Point entry routes
  app.get('/api/point-entries', isAuthenticated, async (req, res) => {
    try {
      const personnelId = req.query.personnelId ? parseInt(req.query.personnelId as string) : undefined;
      const entries = await storage.getPointEntries(personnelId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching point entries:", error);
      res.status(500).json({ message: "Failed to fetch point entries" });
    }
  });

  app.post('/api/point-entries', isAuthenticated, async (req: any, res) => {
    try {
      const validation = insertPointEntrySchema.safeParse({
        ...req.body,
        enteredBy: req.user.claims.sub,
      });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      // Check if entry already exists for this week
      const existingEntry = await storage.getWeeklyPoints(
        validation.data.personnelId,
        validation.data.weekStart
      );
      
      if (existingEntry) {
        return res.status(400).json({ message: "Points already entered for this week" });
      }

      const entry = await storage.createPointEntry(validation.data);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating point entry:", error);
      res.status(500).json({ message: "Failed to create point entry" });
    }
  });

  // Promotion routes
  app.get('/api/promotions', isAuthenticated, async (req, res) => {
    try {
      const personnelId = req.query.personnelId ? parseInt(req.query.personnelId as string) : undefined;
      const promotions = await storage.getPromotions(personnelId);
      res.json(promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.post('/api/promotions', isAuthenticated, async (req: any, res) => {
    try {
      const validation = insertPromotionSchema.safeParse({
        ...req.body,
        promotedBy: req.user.claims.sub,
      });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      const promotion = await storage.createPromotion(validation.data);
      res.status(201).json(promotion);
    } catch (error) {
      console.error("Error creating promotion:", error);
      res.status(500).json({ message: "Failed to create promotion" });
    }
  });

  // Ranks routes
  app.get('/api/ranks', isAuthenticated, async (req, res) => {
    try {
      const ranks = await storage.getRanks();
      res.json(ranks);
    } catch (error) {
      console.error("Error fetching ranks:", error);
      res.status(500).json({ message: "Failed to fetch ranks" });
    }
  });

  // Special positions routes
  app.get('/api/special-positions', isAuthenticated, async (req, res) => {
    try {
      const positions = await storage.getSpecialPositions();
      res.json(positions);
    } catch (error) {
      console.error("Error fetching special positions:", error);
      res.status(500).json({ message: "Failed to fetch special positions" });
    }
  });

  // Initialize database with default ranks and special positions
  app.post('/api/initialize', isAuthenticated, async (req: any, res) => {
    try {
      // Only allow admin users to initialize (you can customize this logic)
      // For now, allow any authenticated user
      
      // Create default ranks
      const defaultRanks = [
        { level: 2, name: "Private", pointsRequired: 0, pointsFromPrevious: 0 },
        { level: 3, name: "Private First Class", pointsRequired: 100, pointsFromPrevious: 100 },
        { level: 4, name: "Specialist", pointsRequired: 250, pointsFromPrevious: 150 },
        { level: 5, name: "Corporal", pointsRequired: 400, pointsFromPrevious: 150 },
        { level: 6, name: "Sergeant", pointsRequired: 600, pointsFromPrevious: 200 },
        { level: 7, name: "Staff Sergeant", pointsRequired: 850, pointsFromPrevious: 250 },
        { level: 8, name: "Sergeant First Class", pointsRequired: 1150, pointsFromPrevious: 300 },
        { level: 9, name: "Master Sergeant", pointsRequired: 1500, pointsFromPrevious: 350 },
        { level: 10, name: "Sergeant Major", pointsRequired: 1900, pointsFromPrevious: 400 },
        { level: 11, name: "Second Lieutenant", pointsRequired: 2350, pointsFromPrevious: 450 },
        { level: 12, name: "First Lieutenant", pointsRequired: 2850, pointsFromPrevious: 500 },
        { level: 13, name: "Captain", pointsRequired: 3400, pointsFromPrevious: 550 },
        { level: 14, name: "Major", pointsRequired: 4000, pointsFromPrevious: 600 },
        { level: 15, name: "Colonel", pointsRequired: 4650, pointsFromPrevious: 650 },
      ];

      // Create default special positions
      const defaultPositions = [
        { name: "Leitstellenausbilder", difficulty: "easy", bonusPointsPerWeek: 5, description: "Leitstellenausbildung" },
        { name: "Field Medic", difficulty: "easy", bonusPointsPerWeek: 5, description: "Medizinische Versorgung" },
        { name: "U1 Ausbilder", difficulty: "medium", bonusPointsPerWeek: 10, description: "U1 Ausbildung" },
        { name: "Aktenkunde Ausbilder", difficulty: "medium", bonusPointsPerWeek: 10, description: "Aktenkunde Ausbildung" },
        { name: "Personalabteilung", difficulty: "hard", bonusPointsPerWeek: 15, description: "Personalverwaltung" },
        { name: "Drill Sergeant", difficulty: "hard", bonusPointsPerWeek: 15, description: "Grundausbildung" },
        { name: "GWD Ausbilder", difficulty: "hard", bonusPointsPerWeek: 15, description: "GWD Ausbildung" },
      ];

      // Insert ranks and positions (only if they don't exist)
      for (const rank of defaultRanks) {
        try {
          await storage.createRank(rank);
        } catch (error) {
          // Rank might already exist, ignore
        }
      }

      for (const position of defaultPositions) {
        try {
          await storage.createSpecialPosition(position);
        } catch (error) {
          // Position might already exist, ignore
        }
      }

      res.json({ message: "Database initialized successfully" });
    } catch (error) {
      console.error("Error initializing database:", error);
      res.status(500).json({ message: "Failed to initialize database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
