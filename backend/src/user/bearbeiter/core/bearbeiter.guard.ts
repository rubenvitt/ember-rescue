import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { extractBearbeiterName } from '../../../utils/header.utils';

@Injectable()
export class BearbeiterGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearbeiterHeader = request.headers['bearbeiter'];

    if (!bearbeiterHeader) {
      return false;
    }

    const bearbeiterName = extractBearbeiterName(bearbeiterHeader);
    if (!bearbeiterName) {
      return false;
    }

    request.bearbeiter = { name: bearbeiterName };
    return true;
  }
}
