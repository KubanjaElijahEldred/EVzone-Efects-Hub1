import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AppRoutesModule } from './modules/app-routes/app-routes.module';
import { AssetsModule } from './modules/assets/assets.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { HealthModule } from './modules/health/health.module';
import { HomeModule } from './modules/home/home.module';
import { EditorModule } from './modules/editor/editor.module';
import { InsightsModule } from './modules/insights/insights.module';
import { InteractiveModule } from './modules/interactive/interactive.module';
import { LearningModule } from './modules/learning/learning.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { PreviewModule } from './modules/preview/preview.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RecoveryModule } from './modules/recovery/recovery.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { SearchModule } from './modules/search/search.module';
import { SendToStudioModule } from './modules/send-to-studio/send-to-studio.module';
import { SettingsModule } from './modules/settings/settings.module';
import { StudioBridgeModule } from './modules/studio-bridge/studio-bridge.module';
import { StudioIntegrationModule } from './modules/studio-integration/studio-integration.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { VfxModule } from './modules/vfx/vfx.module';
import { VisualLogicModule } from './modules/visual-logic/visual-logic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 240 }]),
    DatabaseModule,
    HealthModule,
    HomeModule,
    EditorModule,
    AppRoutesModule,
    StudioBridgeModule,
    ProjectsModule,
    AssetsModule,
    ResourcesModule,
    AiModule,
    TrackingModule,
    VisualLogicModule,
    DeveloperModule,
    MaterialsModule,
    VfxModule,
    InteractiveModule,
    PreviewModule,
    StudioIntegrationModule,
    SendToStudioModule,
    LearningModule,
    InsightsModule,
    SettingsModule,
    AdminModule,
    RecoveryModule,
    MaintenanceModule,
    SearchModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
