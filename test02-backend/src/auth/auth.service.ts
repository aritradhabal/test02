import { ConflictException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.prisma.PrismaClient.user.findUnique({
      where: { username },
    });
    if (!findUser) return null;
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (isPasswordValid) {
      const payload = { id: findUser.id, username: findUser.username };
      return this.jwtService.sign(payload);
    }
  }
  async register({ username, password }: AuthPayloadDto) {
    const exists = await this.prisma.PrismaClient.user.findUnique({
      where: { username },
    });
    if (exists) {
      throw new ConflictException('Username already taken');
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await this.prisma.PrismaClient.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    const payload = { id: newUser.id, username: newUser.username };
    return this.jwtService.sign(payload);
  }
}
