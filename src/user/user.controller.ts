import { Controller, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateHolidaysDto } from './dto/holiday.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Post('/:userId/calendar/holidays')
  async addHolidaysToCalendar(
    @Param('userId') userId: string,
    @Body() createHolidaysDto: CreateHolidaysDto,
  ) {
    const result = await this.userService.addHolidaysToCalendar(
      userId,
      createHolidaysDto,
    );
    return result;
  }
}
