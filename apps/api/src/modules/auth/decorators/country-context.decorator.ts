import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CountryCode } from '@dhanshree/shared';

export const CountryContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CountryCode => {
    const request = ctx.switchToHttp().getRequest();
    const headerCountry = request.headers['x-country-code']?.toString().toUpperCase();
    const queryCountry = request.query?.country?.toString().toUpperCase();

    const candidate = headerCountry || queryCountry;

    if (candidate === CountryCode.NEPAL || candidate === CountryCode.INDIA || candidate === CountryCode.UAE) {
      return candidate as CountryCode;
    }

    return CountryCode.NEPAL; // Default marketplace anchor
  },
);
