import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PreviewController } from './preview.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PreviewController],
})
export class PreviewModule {}
