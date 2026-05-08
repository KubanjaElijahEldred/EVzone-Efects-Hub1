import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppStateService } from '../../database/app-state.service';

@ApiTags('Visual Logic Lab')
@Controller('visual-logic')
export class VisualLogicController {
  constructor(private readonly state: AppStateService) {}

  @Get('node-types')
  nodeTypes() {
    return [
      'Studio control node',
      'Gesture trigger node',
      'Face expression node',
      'Audio beat node',
      'Timer node',
      'Randomizer node',
      'Score/count node',
      'Object visibility node',
      'Material change node',
      'VFX spawn node',
      'Scene switch node',
    ];
  }

  @Get('graphs')
  graphs() {
    return [
      { id: 'graph-smile-confetti', title: 'Smile Confetti Trigger', nodes: 14, status: 'ready' },
      { id: 'graph-countdown-reveal', title: 'Countdown Reveal Subgraph', nodes: 9, status: 'ready' },
    ];
  }

  @Get('graphs/:id')
  graph(@Param('id') id: string) {
    return {
      id,
      title: id.replaceAll('-', ' '),
      variables: ['isVisible', 'score', 'timer'],
      nodes: [
        { id: 'start', type: 'trigger', label: 'Studio Button' },
        { id: 'condition', type: 'condition', label: 'If Live Segment Active' },
        { id: 'action', type: 'action', label: 'Spawn VFX' },
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'condition' },
        { id: 'e2', source: 'condition', target: 'action' },
      ],
    };
  }

  @Post('graphs')
  createGraph(@Body() body: Record<string, unknown>) {
    return { id: this.state.id('graph'), ...body, createdAt: this.state.now(), status: 'draft' };
  }

  @Post('generate')
  generate(@Body() body: Record<string, unknown>) {
    return {
      id: this.state.id('graph-ai'),
      prompt: body.prompt,
      title: 'AI Generated Studio Interaction Graph',
      nodes: this.nodeTypes().slice(0, 5).map((type, index) => ({ id: `node-${index}`, type })),
      createdAt: this.state.now(),
    };
  }

  @Post('debug')
  debug(@Body() body: Record<string, unknown>) {
    return {
      sessionId: this.state.id('debug'),
      input: body,
      activePath: ['Studio Button', 'Condition Builder', 'VFX Spawn Node'],
      values: { isVisible: true, score: 12, timer: 30 },
      warnings: [],
    };
  }
}
