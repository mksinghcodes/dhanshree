import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CalculateTaxDto } from './dto/tax-calculation.dto';
import { CurrencyCode } from '@dhanshree/shared';
import { PublicRateLimit } from '../rate-limit';

@ApiTags('Countries & Taxation')
@Controller('api/v1')
@PublicRateLimit()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('countries')
  @ApiOperation({ summary: 'List all operational countries (Nepal, India, UAE) and their configurations' })
  getCountries() {
    return {
      status: 'SUCCESS',
      count: 3,
      data: this.countryService.getAllCountries(),
    };
  }

  @Get('countries/:code')
  @ApiOperation({ summary: 'Retrieve full regional profile, tax rules, and payment gateways for a country' })
  getCountry(@Param('code') code: string) {
    return {
      status: 'SUCCESS',
      data: this.countryService.getCountry(code),
    };
  }

  @Get('currencies')
  @ApiOperation({ summary: 'List supported currencies (NPR, INR, AED) with base exchange rates' })
  getCurrencies() {
    return {
      status: 'SUCCESS',
      data: this.countryService.getAllCurrencies(),
    };
  }

  @Get('currencies/convert')
  @ApiOperation({ summary: 'Convert amount between currencies (NPR, INR, AED, USD)' })
  convertCurrency(
    @Query('amount') amount: number,
    @Query('from') from: CurrencyCode,
    @Query('to') to: CurrencyCode,
  ) {
    return {
      status: 'SUCCESS',
      data: this.countryService.convert(Number(amount), from, to),
    };
  }

  @Post('tax/calculate')
  @ApiOperation({ summary: 'Calculate localized tax (Nepal 13% VAT, India GST/TCS, UAE 5% VAT with TRN)' })
  @ApiResponse({ status: 200, description: 'Calculated tax breakdown' })
  calculateTax(@Body() dto: CalculateTaxDto) {
    return {
      status: 'SUCCESS',
      data: this.countryService.calculateTax(dto),
    };
  }
}
