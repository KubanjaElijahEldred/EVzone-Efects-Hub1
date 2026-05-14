import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SettingsController } from './settings.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SettingsController],
})
export class SettingsModule {}
