import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getDBStatus, localStore } from '../config/db.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super_secret_tree_plantation_tracker_key_2026';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'volunteer', organization, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const { connectedToMongo } = getDBStatus();

    if (connectedToMongo) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        organization: organization || 'Community Green Team',
        phone: phone || '',
      });

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          phone: user.phone,
        },
      });
    } else {
      const existing = localStore.data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = {
        _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        organization: organization || 'Community Green Team',
        phone: phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStore.data.users.push(newUser);
      localStore.save();

      const { password: _, ...userSafe } = newUser;
      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: userSafe,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const { connectedToMongo } = getDBStatus();

    if (connectedToMongo) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          phone: user.phone,
        },
      });
    } else {
      const user = localStore.data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const { password: _, ...userSafe } = user;
      return res.json({
        success: true,
        token: generateToken(user._id),
        user: userSafe,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// @desc    Get demo accounts for quick one-click login
// @route   GET /api/auth/demo-users
export const getDemoUsers = async (req, res) => {
  res.json({
    success: true,
    demoAccounts: [
      {
        role: 'admin',
        title: 'Admin Supervisor',
        email: 'admin@treetracker.org',
        password: 'admin123',
        description: 'Full privileges: Add, edit, inspect, delete, and view system health',
      },
      {
        role: 'planter',
        title: 'Green Planter',
        email: 'planter@treetracker.org',
        password: 'planter123',
        description: 'Field planter: Add new trees, update planted trees & health status',
      },
      {
        role: 'volunteer',
        title: 'Aarav Patel (Volunteer)',
        email: 'aarav@treetracker.org',
        password: 'user123',
        description: 'Community volunteer: View records, browse directory, check analytics',
      },
    ],
  });
};
