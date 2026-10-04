import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RateLimitService } from '../rate-limit.service';

@Injectable()
export class RateLimitAuthInterceptor implements NestInterceptor {
  constructor(private readonly rateLimitService: RateLimitService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const accountIdentifier = req._rateLimitAccount;

    return next.handle().pipe(
      tap(() => {
        // Successful response: reset failures for this account
        if (accountIdentifier) {
          this.rateLimitService.recordAuthSuccess(accountIdentifier);
        }
      }),
      catchError((err) => {
        // Only increment failures for actual authentication/credential failures (e.g. 401, 400, 403)
        // Do NOT re-increment if the request was blocked by 429 Too Many Requests
        const status = err.getStatus ? err.getStatus() : err.status;
        if (status !== HttpStatus.TOO_MANY_REQUESTS && accountIdentifier) {
          this.rateLimitService.recordAuthFailure(accountIdentifier);
        }
        return throwError(() => err);
      }),
    );
  }
}
