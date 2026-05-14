import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackingController],
})
export class TrackingModule {}
