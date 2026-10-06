/**
 * Standalone Backend Server for '3D Car website'
 * Connects to MongoDB if running, or falls back to embedded persistent document storage.
 * 
 * Usage:
 *   node server/mongodb-server.cjs
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = '3D Car website';

app.use(cors());
app.use(express.json());

// Persistent fallback storage in server/data directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLocal(name, defaultVal = []) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return defaultVal;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultVal;
  }
}

function saveLocal(name, data) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to save local store ${name}:`, err.message);
  }
}

let db = null;
let mongoMode = false;

// In-memory / JSON fallback collections
let localUsers = loadLocal('users');
let localSetups = loadLocal('setups');
let localTelemetry = loadLocal('telemetry');

async function start() {
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    db = client.db(DB_NAME);
    mongoMode = true;
    console.log(`[MongoDB] Connected successfully to "${DB_NAME}" at ${MONGO_URI}`);
  } catch (err) {
    mongoMode = false;
    console.log(`[Backend Storage] MongoDB not connected (${err.message}). Using persistent embedded storage at ${DATA_DIR}.`);
  }

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: DB_NAME,
      storageEngine: mongoMode ? 'MongoDB Live' : 'Embedded Document Store',
      timestamp: new Date().toISOString(),
    });
  });

  // Users Collection
  app.post('/api/users', async (req, res) => {
    try {
      const user = { ...req.body, updatedAt: new Date().toISOString() };
      if (mongoMode && db) {
        const usersCol = db.collection('users');
        await usersCol.updateOne({ email: user.email }, { $set: user }, { upsert: true });
      } else {
        const existingIdx = localUsers.findIndex((u) => u.email === user.email);
        if (existingIdx >= 0) {
          localUsers[existingIdx] = { ...localUsers[existingIdx], ...user };
        } else {
          localUsers.push(user);
        }
        saveLocal('users', localUsers);
      }
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users', async (req, res) => {
    try {
      if (mongoMode && db) {
        const users = await db.collection('users').find({}).limit(50).toArray();
        res.json(users);
      } else {
        res.json(localUsers);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Setups Collection
  app.post('/api/setups', async (req, res) => {
    try {
      const setup = {
        ...req.body,
        _id: req.body._id || 'setup_' + Math.random().toString(36).substr(2, 9),
        timestamp: req.body.timestamp || new Date().toISOString(),
      };

      if (mongoMode && db) {
        const setupsCol = db.collection('setups');
        const result = await setupsCol.insertOne(setup);
        res.json({ success: true, insertedId: result.insertedId, setup });
      } else {
        localSetups.unshift(setup);
        saveLocal('setups', localSetups);
        res.json({ success: true, insertedId: setup._id, setup });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/setups', async (req, res) => {
    try {
      if (mongoMode && db) {
        const setupsCol = db.collection('setups');
        const setups = await setupsCol.find({}).sort({ timestamp: -1 }).limit(50).toArray();
        res.json(setups);
      } else {
        res.json(localSetups);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Telemetry Collection
  app.post('/api/telemetry', async (req, res) => {
    try {
      const entry = {
        ...req.body,
        _id: req.body._id || 'telem_' + Math.random().toString(36).substr(2, 9),
        timestamp: req.body.timestamp || new Date().toISOString(),
      };

      if (mongoMode && db) {
        const telemCol = db.collection('telemetry');
        const result = await telemCol.insertOne(entry);
        res.json({ success: true, insertedId: result.insertedId, telemetry: entry });
      } else {
        localTelemetry.unshift(entry);
        saveLocal('telemetry', localTelemetry);
        res.json({ success: true, insertedId: entry._id, telemetry: entry });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/telemetry', async (req, res) => {
    try {
      if (mongoMode && db) {
        const telem = await db.collection('telemetry').find({}).sort({ timestamp: -1 }).limit(50).toArray();
        res.json(telem);
      } else {
        res.json(localTelemetry);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`[3D Car website Backend] Server listening live on http://localhost:${PORT}`);
  });

  return server;
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
