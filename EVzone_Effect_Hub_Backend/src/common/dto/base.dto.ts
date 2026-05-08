import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  scope?: string;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  type = 'Studio Overlay + Face AR';

  @IsString()
  @IsOptional()
  category = 'Live Graphics';

  @IsArray()
  @IsOptional()
  tags: string[] = [];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cameraTarget = 'Host Camera';
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  internalNotes?: string;

  @IsNumber()
  @IsOptional()
  qualityScore?: number;
}

export class AddNoteDto {
  @IsString()
  @IsOptional()
  author = 'EVzone Operator';

  @IsString()
  @IsNotEmpty()
  note!: string;
}

export class CreateVersionDto {
  @IsString()
  @IsOptional()
  notes = 'Manual snapshot';

  @IsNumber()
  @IsOptional()
  qualityScore = 90;
}

export class ResourceActionDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsBoolean()
  @IsOptional()
  remix = false;
}

export class AIGenerateDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsString()
  @IsIn(['effect', 'filter', 'background', 'overlay', 'vfx', 'material', 'texture', 'script', 'node-graph', 'animation', 'sound'])
  target!: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, unknown>;
}

export class StudioEventDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}

export class StudioBindingDto {
  @IsString()
  scene = 'Morning Show';

  @IsString()
  camera = 'Host Camera';

  @IsString()
  overlayLayer = 'Lower Third';

  @IsString()
  trigger = 'Scene Change + Studio Button';

  @IsString()
  controlSurface = 'EVzone Operator Surface A';

  @IsString()
  fallbackMode = 'Keep overlay, disable heavy VFX';

  @IsBoolean()
  emergencyDisable = false;
}

export class PreviewSessionDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  source = 'EVzone Studio Camera';

  @IsString()
  @IsOptional()
  subject = 'Single Face';

  @IsString()
  @IsOptional()
  deviceFrame = 'Studio 16:9';
}

export class DiagnosticDto {
  @IsString()
  @IsIn(['info', 'warning', 'critical', 'recoverable'])
  level!: 'info' | 'warning' | 'critical' | 'recoverable';

  @IsString()
  source!: string;

  @IsString()
  message!: string;

  @IsString()
  @IsOptional()
  projectId?: string;
}

export class SettingsUpdateDto {
  @IsObject()
  settings!: Record<string, unknown>;
}

export class MaintenanceUpdateDto {
  @IsString()
  @IsIn(['maintenance', 'partial-update', 'operational'])
  mode!: 'maintenance' | 'partial-update' | 'operational';

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  estimatedRecoveryTime?: string;
}

export class RuntimeLimitDto {
  @IsNumber()
  @Min(30)
  @Max(120)
  targetFps = 60;

  @IsNumber()
  @Min(1)
  @Max(100)
  maxPackageMb = 10;

  @IsNumber()
  @Min(512)
  @Max(8192)
  maxTexturePx = 2048;
}
