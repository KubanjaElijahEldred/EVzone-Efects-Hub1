import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { VisualLogicController } from './visual-logic.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [VisualLogicController],
})
export class VisualLogicModule {}
