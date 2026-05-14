import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Tracking Lab')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly state: AppStateService) {}

  @Get('capabilities')
  capabilities() {
    return {
      face: ['Face landmarks', 'Face mesh', 'Face avatar drive', 'Expression triggers', 'Face occlusion'],
      expressions: ['Smile', 'Blink', 'Wink', 'Mouth open', 'Eyebrows', 'Head nod', 'Head shake'],
      hand: ['Wave', 'Peace sign', 'Pinch', 'Open palm', 'Fist', 'Thumbs up'],
      body: ['Pose tracking', 'Body avatar drive', 'Character drive'],
      world: ['World AR placement', 'Plane detection', 'Anchors', 'Image tracking', 'Object tracking'],
      segmentation: ['Person segmentation', 'Background removal', 'Green screen enhancement', 'Depth and occlusion'],
    };
  }

  @Get('presets')
  presets() {
    return [
      { id: 'face-avatar-drive', title: 'Face Avatar Drive Starter', type: 'face', stability: 94 },
      { id: 'gesture-trigger-pack', title: 'Gesture Trigger Pack', type: 'hand', stability: 91 },
      { id: 'segmentation-studio', title: 'Segmentation Studio Preset', type: 'segmentation', stability: 89 },
    ];
  }

  @Post('calibrate')
  calibrate(@Body() body: Record<string, unknown>) {
    return {
      calibrationId: this.state.id('cal'),
      status: 'calibrated',
      stabilityScore: 93,
      input: body,
      recommendations: ['Improve key light', 'Enable studio button fallback', 'Keep subject inside safe frame'],
      createdAt: this.state.now(),
    };
  }

  @Post('test')
  test(@Body() body: Record<string, unknown>) {
    return {
      testId: this.state.id('track-test'),
      input: body,
      stabilityScore: 92,
      warnings: ['Hand tracking drops in low light'],
      fallbackReady: true,
      createdAt: this.state.now(),
    };
  }
}
