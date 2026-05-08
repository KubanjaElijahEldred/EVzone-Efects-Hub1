import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MaintenanceController } from './maintenance.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MaintenanceController],
})
export class MaintenanceModule {}
