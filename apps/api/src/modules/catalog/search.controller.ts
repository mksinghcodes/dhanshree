import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CountryCode } from '@dhanshree/shared';
import { PublicRateLimit } from '../rate-limit';

@ApiTags('Catalog: Search & Typeahead')
@Controller('api/v1/search')
@PublicRateLimit()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Instant search autocomplete with query suggestions, categories, and product previews' })
  async autocomplete(
    @Query('q') q: string,
    @Query('countryCode') countryCode?: CountryCode,
  ) {
    const data = await this.searchService.autocomplete(q, countryCode);
    return {
      status: 'SUCCESS',
      data,
    };
  }
}
