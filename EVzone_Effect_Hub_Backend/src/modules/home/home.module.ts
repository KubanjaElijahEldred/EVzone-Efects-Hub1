import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { HomeController } from './home.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [HomeController],
})
export class HomeModule {}
