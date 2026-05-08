import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SendToStudioController } from './send-to-studio.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SendToStudioController],
})
export class SendToStudioModule {}
