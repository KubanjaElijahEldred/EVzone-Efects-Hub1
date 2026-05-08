import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ id?: string }>();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        requestId: request.id,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
