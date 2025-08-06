import { Module } from '@nestjs/common';
import { DiceModule } from './dice/dice.module';
import { AppController } from './app.controller';

@Module({
  imports: [DiceModule],
  controllers: [AppController],
})
export class AppModule {}
