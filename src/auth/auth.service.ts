import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPass = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPass,
      },
    });

    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  private generateTokens(userId: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '1h', secret: jwtSecret },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d', secret: jwtSecret },
    );

    return { accessToken, refreshToken };
  }
}
