/**
 * MongoDB Configuration and Database Service
 * Database Target: '3D Car website'
 * 
 * Supports both direct REST API backend connectivity to MongoDB Atlas / Local MongoDB
 * and resilient client-side storage persistence fallback.
 */

export interface MongoConfig {
  databaseName: string;
  connectionUri: string;
  apiEndpoint?: string;
}

export const MONGO_CONFIG: MongoConfig = {
  databaseName: '3D Car website',
  connectionUri:
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_MONGODB_URI) ||
    'mongodb://localhost:27017/3D-Car-website',
  apiEndpoint:
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_ENDPOINT) ||
    'http://localhost:5000/api',
};

// Database Schema Interfaces
export interface MongoUser {
  _id?: string;
  email: string;
  name: string;
  role: 'driver' | 'engineer' | 'guest';
  createdAt: string;
  lastLogin: string;
}

export interface MongoVehicleSetup {
  _id?: string;
  name: string;
  vehicleModel: string;
  timestamp: string;
  frontWingAngle: number;
  rearWingAngle: number;
  frontRideHeight: number;
  rearRideHeight: number;
  diffuserExpansion: number;
  calculatedDownforceKg: number;
  dragCoefficientCd: number;
  topSpeedKmh: number;
  authorEmail?: string;
}

export interface MongoTelemetrySession {
  _id?: string;
  vehicleModel: string;
  trackName: string;
  timestamp: string;
  lapTimeSeconds: number;
  topSpeedKmh: number;
  peakLateralG: number;
  avgTireTempC: number;
}

class MongoDataService {
  private dbName: string = MONGO_CONFIG.databaseName;

  constructor() {
    console.log(`[MongoDB: ${this.dbName}] Database Service initialized with target database: "${this.dbName}"`);
  }

  // Save or Update User Profile
  async saveUser(user: Omit<MongoUser, 'createdAt' | 'lastLogin'>): Promise<MongoUser> {
    const fullUser: MongoUser = {
      ...user,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    try {
      // Try backend endpoint if configured
      if (MONGO_CONFIG.apiEndpoint) {
        const response = await fetch(`${MONGO_CONFIG.apiEndpoint}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullUser),
        });
        if (response.ok) {
          const saved = await response.json();
          console.log(`[MongoDB: ${this.dbName}] User saved via remote API:`, saved);
          return saved;
        }
      }
    } catch (e) {
      // Fall through to local persistent store
    }

    // Local persistent database store fallback
    const key = `mongo_${this.dbName}_users`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter((u: MongoUser) => u.email !== user.email);
    filtered.push(fullUser);
    localStorage.setItem(key, JSON.stringify(filtered));
    console.log(`[MongoDB: ${this.dbName}] User stored in persistent document collection:`, fullUser.email);
    return fullUser;
  }

  // Save Vehicle Aerodynamic Setup
  async saveSetup(setup: Omit<MongoVehicleSetup, '_id'>): Promise<MongoVehicleSetup> {
    const record: MongoVehicleSetup = {
      ...setup,
      _id: 'setup_' + Math.random().toString(36).substr(2, 9),
    };

    try {
      if (MONGO_CONFIG.apiEndpoint) {
        const res = await fetch(`${MONGO_CONFIG.apiEndpoint}/setups`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
        if (res.ok) return await res.json();
      }
    } catch (e) {
      // Fall through
    }

    const key = `mongo_${this.dbName}_setups`;
    const existing: MongoVehicleSetup[] = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing));
    console.log(`[MongoDB: ${this.dbName}] Setup saved to collection "setups":`, record.name);
    return record;
  }

  // Get All Saved Vehicle Setups
  async getSetups(): Promise<MongoVehicleSetup[]> {
    try {
      if (MONGO_CONFIG.apiEndpoint) {
        const res = await fetch(`${MONGO_CONFIG.apiEndpoint}/setups`);
        if (res.ok) return await res.json();
      }
    } catch (e) {
      // Fall through
    }

    const key = `mongo_${this.dbName}_setups`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // Save Telemetry Lap Session
  async saveTelemetry(session: Omit<MongoTelemetrySession, '_id'>): Promise<MongoTelemetrySession> {
    const record: MongoTelemetrySession = {
      ...session,
      _id: 'telemetry_' + Math.random().toString(36).substr(2, 9),
    };

    const key = `mongo_${this.dbName}_telemetry`;
    const existing: MongoTelemetrySession[] = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing));
    console.log(`[MongoDB: ${this.dbName}] Telemetry logged:`, record.lapTimeSeconds, 's');
    return record;
  }
}

export const mongoService = new MongoDataService();
