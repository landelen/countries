import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { CreateHolidaysDto } from './dto/holiday.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly nagerUrl: string;
  constructor(
    private http: HttpService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.nagerUrl = this.configService.get<string>('NAGER_URL');
  }

  async findUserById(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async addHolidaysToCalendar(
    userId: string,
    createHolidaysDto: CreateHolidaysDto,
  ) {
    const { countryCode, year, holidays } = createHolidaysDto;
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${this.nagerUrl}/PublicHolidays/${year}/${countryCode}`),
      );
      const filteredHolidays = data.filter((holiday) =>
        holidays.length > 0
          ? holidays.some((h) => holiday.name.toLowerCase() === h.toLowerCase())
          : true,
      );
      await this.prisma.userCalendar.create({
        data: {
          userId,
          countryCode,
          year,
          holidays: filteredHolidays.map((holiday) => holiday.name),
        },
      });

      return { message: 'Holidays added to calendar' };
    } catch (error) {
      throw error;
    }
  }
}
