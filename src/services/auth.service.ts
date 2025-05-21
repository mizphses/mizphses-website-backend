import { createId } from '@paralleldrive/cuid2';
import { PrismaD1 } from '@prisma/adapter-d1';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client';
import { createRefreshToken, createToken } from '../lib/jwt';

export class AuthService {
  private prisma: PrismaClient;

  constructor(db: D1Database) {
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter });
  }

  async signup(email: string, password: string, name: string, jwtSecret: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name,
      },
    });

    if (!newUser) {
      throw new Error('User creation failed');
    }

    return this.createTokens(newUser.id, jwtSecret);
  }

  async login(email: string, password: string, jwtSecret: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return this.createTokens(user.id, jwtSecret);
  }

  async refreshToken(refreshToken: string, jwtSecret: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // 古いリフレッシュトークンを削除
    await this.prisma.refreshToken.delete({
      where: { id: token.id },
    });

    return this.createTokens(token.userId, jwtSecret);
  }

  private async createTokens(userId: string, jwtSecret: string) {
    try {
      const accessToken = await createToken(
        {
          uid: userId || '',
          jti: createId(),
        },
        jwtSecret
      );

      const refreshToken = createRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30日間有効

      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: userId,
          expiresAt,
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      console.error(e);
      throw new Error('Token creation failed');
    }
  }
}
