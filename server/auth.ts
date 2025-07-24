import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, RequestHandler } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import type { AdminUser } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends AdminUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function setupAuth(app: Express) {
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false, // Don't try to create table/index as they already exist
    ttl: 7 * 24 * 60 * 60, // 7 days
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "nc-army-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getAdminUserByUsername(username);
        if (!user || !user.isActive) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }

        // Update last login
        await storage.updateAdminUserLastLogin(user.id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getAdminUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json({ user: req.user, message: "Login successful" });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export { hashPassword };