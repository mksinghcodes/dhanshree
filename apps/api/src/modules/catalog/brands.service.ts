import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandItem } from '@dhanshree/shared';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly mockBrands: BrandItem[] = [
    {
      id: 'brand-sony',
      name: 'Sony',
      slug: 'sony',
      logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120',
      description: 'Global leader in audio, cameras, and consumer electronics',
      isFeatured: true,
      productCount: 42,
    },
    {
      id: 'brand-apple',
      name: 'Apple',
      slug: 'apple',
      logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120',
      description: 'Pioneering smartphones, wearables, and personal computing',
      isFeatured: true,
      productCount: 56,
    },
    {
      id: 'brand-himalayan-herbs',
      name: 'Himalayan Organic Tea Co.',
      slug: 'himalayan-tea-co',
      logoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=120',
      description: 'Certified organic artisanal high-altitude teas harvested in Ilam, Nepal',
      isFeatured: true,
      productCount: 28,
    },
    {
      id: 'brand-ajmal-oud',
      name: 'Al-Mansoor Arabian Oud',
      slug: 'al-mansoor-oud',
      logoUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=120',
      description: 'Royal perfumes, pure distilled Dehn Al Oud, and fine Dubai bakhoors',
      isFeatured: true,
      productCount: 34,
    },
    {
      id: 'brand-boAt',
      name: 'boAt Lifestyle',
      slug: 'boat',
      logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120',
      description: 'India top audio and smartwatch lifestyle tech brand',
      isFeatured: true,
      productCount: 65,
    },
  ];

  async getBrands(): Promise<BrandItem[]> {
    try {
      const dbBrands = await this.prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      if (dbBrands && dbBrands.length > 0) {
        return dbBrands.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          logoUrl: b.logoUrl,
          description: b.description,
          websiteUrl: b.websiteUrl,
          isFeatured: b.isFeatured,
        }));
      }
    } catch {
      // Fallback
    }

    return this.mockBrands;
  }

  async getBrandBySlug(slug: string): Promise<BrandItem> {
    const brands = await this.getBrands();
    const found = brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
    if (!found) {
      throw new NotFoundException(`Brand '${slug}' not found`);
    }
    return found;
  }
}
