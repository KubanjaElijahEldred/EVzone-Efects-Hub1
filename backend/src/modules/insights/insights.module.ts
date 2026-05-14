import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { InsightsController } from './insights.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [InsightsController],
})
export class InsightsModule {}
