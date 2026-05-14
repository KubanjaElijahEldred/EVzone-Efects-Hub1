import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MaterialsController } from './materials.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MaterialsController],
})
export class MaterialsModule {}
