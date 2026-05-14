import { Module } from '@nestjs/common';
    import { DatabaseModule } from '../../database/database.module';
    import { StudioBridgeController } from './studio-bridge.controller';
    import { StudioBridgeGateway } from './studio-bridge.gateway';

    @Module({
      imports: [DatabaseModule],
      controllers: [StudioBridgeController],
      providers: [StudioBridgeGateway],
})
    export class StudioBridgeModule {}
