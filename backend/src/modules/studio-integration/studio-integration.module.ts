import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StudioIntegrationController } from './studio-integration.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [StudioIntegrationController],
})
export class StudioIntegrationModule {}
