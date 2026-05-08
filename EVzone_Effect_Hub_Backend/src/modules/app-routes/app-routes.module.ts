import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AppRoutesController } from './app-routes.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AppRoutesController],
})
export class AppRoutesModule {}
