import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // In production, use bcrypt to compare hashed password
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { team: true },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
console.log('Authenticating user:', user, );

    // Simple password check - in production, use bcrypt
    if (password !== 'password123' ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teamId: user.teamId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        teamName: user.team?.name,
      },
    };

  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { team: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teamId: user.teamId,
      teamName: user.team?.name,
    };
  }
}
