import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentBearbeiter = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.bearbeiter;
  },
);
