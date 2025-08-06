import { Injectable } from '@nestjs/common';
import { trace, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class DiceService {
  private readonly tracer = trace.getTracer('dice-lib');

  private rollOnce(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  roll(rolls: number, min: number, max: number): number[] {
    return this.tracer.startActiveSpan('rollTheDice', (span) => {
      try {
        span.setAttribute('custom.tag', 'rolling-dice');
        span.setAttribute('dice.rolls', rolls);
        span.setAttribute('dice.range', `${min}-${max}`);

        const result: number[] = [];
        for (let i = 0; i < rolls; i++) {
          result.push(this.rollOnce(min, max));
        }

        return result;
      } catch (error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        throw error;
      } finally {
        span.end(); // VERY IMPORTANT
      }
    });
  }
}
