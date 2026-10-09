import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { seedTrees, seedUsers } from '../utils/seedData.js';
import User from '../models/User.js';
import Tree from '../models/Tree.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORAGE_FILE = path.join(DATA_DIR, 'storage.json');

let isMongoConnected = false;

// In-memory / JSON file storage fallback
class LocalStore {
  constructor() {
    this.data = { users: [], trees: [] };
    this.load();
  }

  load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.seedInitial();
      }
    } catch (err) {
      console.error('Error reading storage.json, initializing fresh store:', err.message);
      this.seedInitial();
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving storage.json:', err.message);
    }
  }

  seedInitial() {
    const hashedUsers = seedUsers.map((u, idx) => ({
      ...u,
      _id: `user_${Date.now()}_${idx}`,
      password: bcrypt.hashSync(u.password, 8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const trees = seedTrees.map((t, idx) => ({
      ...t,
      _id: `tree_${Date.now()}_${idx}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    this.data = { users: hashedUsers, trees };
    this.save();
  }
}

export const localStore = new LocalStore();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tree_plantation_db';
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${uri} ...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('✅ [DB] Successfully connected to MongoDB server!');
    await seedMongoDatabase();
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ [DB] MongoDB not detected (${error.message}).`);
    console.log('🟢 [DB] Active Mode: Local Persistent Storage Engine (JSON file at backend/data/storage.json).');
    console.log('💡 Note: All MERN CRUD operations, search, filters & stats are fully operational!');
    console.log('👉 To connect to MongoDB Atlas or local MongoDB, provide MONGODB_URI in backend/.env');
  }
};

const seedMongoDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial users into MongoDB...');
      for (const u of seedUsers) {
        await User.create(u);
      }
    }

    const treeCount = await Tree.countDocuments();
    if (treeCount === 0) {
      console.log('🌱 Seeding initial planted trees into MongoDB...');
      await Tree.insertMany(seedTrees);
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err.message);
  }
};

export const getDBStatus = () => ({
  connectedToMongo: isMongoConnected,
  mode: isMongoConnected ? 'MongoDB / Mongoose' : 'Local Persistent Storage Engine',
  storagePath: isMongoConnected ? 'MongoDB Server' : STORAGE_FILE,
});
