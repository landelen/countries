import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [CountryController],
  providers: [CountryService, PrismaService, ConfigService],
})
export class CountryModule {}
