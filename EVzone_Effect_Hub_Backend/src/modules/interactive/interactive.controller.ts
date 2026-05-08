import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Interactive Effects Lab')
@Controller('interactive')
export class InteractiveController {
  constructor(private readonly state: AppStateService) {}

  @Get('presets')
  presets() {
    return [
      'Mini-game builder',
      'Quiz builder',
      'Randomizer',
      'Prize wheel',
      'Poll reaction builder',
      'Countdown builder',
      'Scoreboard builder',
      'Reaction meter',
      'Reward trigger',
      'Confetti trigger',
    ];
  }

  @Post('effects')
  create(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('interactive'), ...body, states: ['Intro', 'Active', 'Success', 'Fail', 'Outro'], createdAt: this.state.now() };
  }

  @Post('test')
  test(@Body() body: Record<string, unknown>) {
    return { sessionId: this.state.id('interactive-test'), input: body, result: 'success', score: 12, fallbackReady: true };
  }
}
