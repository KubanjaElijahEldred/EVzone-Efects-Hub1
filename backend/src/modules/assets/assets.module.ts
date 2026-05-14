import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AssetsController } from './assets.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AssetsController],
})
export class AssetsModule {}
