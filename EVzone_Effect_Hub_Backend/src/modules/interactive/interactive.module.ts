import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { InteractiveController } from './interactive.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [InteractiveController],
})
export class InteractiveModule {}
