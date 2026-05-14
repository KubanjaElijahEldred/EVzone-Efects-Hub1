import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { VfxController } from './vfx.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [VfxController],
})
export class VfxModule {}
