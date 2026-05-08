import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ResourcesController } from './resources.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ResourcesController],
})
export class ResourcesModule {}
