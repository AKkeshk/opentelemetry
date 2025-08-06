import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { context as otelContext, trace } from '@opentelemetry/api';

@Injectable()
export class TelemetryInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const activeContext = otelContext.active();
    const currentSpan = trace.getSpan(activeContext);

    if (currentSpan) {
      currentSpan.setAttribute('custom.tag', 'hello-world');
      currentSpan.setAttribute('http.user_id', '123');
    }

    return next.handle().pipe(
      tap(() => {
        if (currentSpan) {
          currentSpan.addEvent('Response sent');
        }
      }),
    );
  }
}
