import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalAdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.config.get<string>('EVZONE_INTERNAL_ADMIN_KEY');
    if (!expectedKey) return true;
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const providedKey = request.headers['x-evzone-internal-key'];
    return Array.isArray(providedKey) ? providedKey.includes(expectedKey) : providedKey === expectedKey;
  }
}
