import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RecoveryController } from './recovery.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RecoveryController],
})
export class RecoveryModule {}
