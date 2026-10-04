import { Injectable } from '@nestjs/common';
import { CountryCode } from '@dhanshree/shared';
import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async autocomplete(q: string, countryCode: CountryCode = CountryCode.NEPAL) {
    if (!q || q.trim().length === 0) {
      return {
        querySuggestions: [],
        categorySuggestions: [],
        productSuggestions: [],
      };
    }

    const term = q.toLowerCase().trim();

    // 1. Search products
    const searchRes = await this.productsService.searchProducts({
      q: term,
      countryCode,
      limit: 4,
    });

    // 2. Search categories
    const allCategories = await this.categoriesService.getCategoryTree();
    const flatCats: Array<{ id: string; name: string; slug: string }> = [];
    const collect = (nodes: any[]) => {
      for (const node of nodes) {
        flatCats.push({ id: node.id, name: node.name, slug: node.slug });
        if (node.children) collect(node.children);
      }
    };
    collect(allCategories);

    const matchedCats = flatCats
      .filter((c) => c.name.toLowerCase().includes(term) || c.slug.includes(term))
      .slice(0, 3);

    // 3. Query string expansions
    const querySuggestions = Array.from(
      new Set([
        term,
        ...searchRes.products.map((p) => p.title.split(' ').slice(0, 4).join(' ')),
      ]),
    ).slice(0, 5);

    return {
      querySuggestions,
      categorySuggestions: matchedCats,
      productSuggestions: searchRes.products.slice(0, 4).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        thumbnailUrl: p.thumbnailUrl,
        price: p.price,
      })),
    };
  }
}
