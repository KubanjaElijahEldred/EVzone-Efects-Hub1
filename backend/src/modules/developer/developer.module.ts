import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DeveloperController } from './developer.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DeveloperController],
})
export class DeveloperModule {}
