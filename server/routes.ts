import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword } from "./auth";
import { insertPersonnelSchema, insertPointEntrySchema, insertPromotionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Get current user
  app.get('/api/user', isAuthenticated, (req, res) => {
    res.json(req.user);
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
      const weekStart = req.query.weekStart as string;
      const entries = await storage.getPointEntries(personnelId, weekStart);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching point entries:", error);
      res.status(500).json({ message: "Failed to fetch point entries" });
    }
  });

  app.get('/api/point-entries/:weekStart', isAuthenticated, async (req, res) => {
    try {
      const weekStart = req.params.weekStart;
      const entries = await storage.getPointEntries(undefined, weekStart);
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

  // Initialize database with default admin user, ranks and special positions
  app.post('/api/initialize', async (req: any, res) => {
    try {
      const { username, password, firstName, lastName, email } = req.body;
      
      // Check if admin user already exists
      const existingAdmin = await storage.getAdminUserByUsername(username || 'admin');
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin user already exists" });
      }

      // Create default admin user
      const hashedPassword = await hashPassword(password || 'admin123');
      await storage.createAdminUser({
        username: username || 'admin',
        password: hashedPassword,
        firstName: firstName || 'Admin',
        lastName: lastName || 'User',
        email: email || 'admin@nc-army.local',
        isActive: true,
      });

      // Create German military ranks (Levels 2-15)
      const defaultRanks = [
        // Mannschaft (2-5)
        { level: 2, name: "Soldat", pointsRequired: 0, pointsFromPrevious: 0 },
        { level: 3, name: "Obersoldat", pointsRequired: 100, pointsFromPrevious: 100 },
        { level: 4, name: "Gefreiter", pointsRequired: 250, pointsFromPrevious: 150 },
        { level: 5, name: "Obergefreiter", pointsRequired: 400, pointsFromPrevious: 150 },
        // Unteroffiziersstab (6-10) 
        { level: 6, name: "Unteroffizier", pointsRequired: 600, pointsFromPrevious: 200 },
        { level: 7, name: "Stabsunteroffizier", pointsRequired: 850, pointsFromPrevious: 250 },
        { level: 8, name: "Feldwebel", pointsRequired: 1150, pointsFromPrevious: 300 },
        { level: 9, name: "Oberfeldwebel", pointsRequired: 1500, pointsFromPrevious: 350 },
        { level: 10, name: "Hauptfeldwebel", pointsRequired: 1900, pointsFromPrevious: 400 },
        // Offiziersstab (11-15)
        { level: 11, name: "Leutnant", pointsRequired: 2350, pointsFromPrevious: 450 },  
        { level: 12, name: "Oberleutnant", pointsRequired: 2850, pointsFromPrevious: 500 },
        { level: 13, name: "Hauptmann", pointsRequired: 3400, pointsFromPrevious: 550 },
        { level: 14, name: "Major", pointsRequired: 4000, pointsFromPrevious: 600 },
        { level: 15, name: "Oberst", pointsRequired: 4650, pointsFromPrevious: 650 },
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

      res.json({ message: "Database initialized successfully with admin user and default data" });
    } catch (error) {
      console.error("Error initializing database:", error);
      res.status(500).json({ message: "Failed to initialize database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
