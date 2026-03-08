import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AuthService {
  /**
   * Admin login
   */
  async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin || !admin.isActive) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '24h' }
    );

    logger.info('Admin logged in', { adminId: admin.id, email: admin.email });

    return {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
  }

  /**
   * Create admin user
   */
  async createAdmin(data: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) {
    // Check if admin exists
    const existing = await prisma.admin.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      throw new ApiError(400, 'Admin with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: data.role
      }
    });

    logger.info('Admin created', { adminId: admin.id, email: admin.email });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
  }

  /**
   * Get current admin
   */
  async getCurrentAdmin(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLoginAt: admin.lastLoginAt
    };
  }
}

export const authService = new AuthService();
