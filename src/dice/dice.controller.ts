import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DiceService } from './dice.service';
@Controller('rolldice')
export class DiceController {
  constructor(private readonly diceService: DiceService) {}

  @Get()
  rollDice(@Query('rolls') rolls: string) {
    const count = parseInt(rolls);
    if (isNaN(count)) {
      throw new BadRequestException(
        "Query param 'rolls' is required and must be a number",
      );
    }

    return this.diceService.roll(count, 1, 6);
  }
}
