import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryNode } from '@dhanshree/shared';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly mockCategoryTree: CategoryNode[] = [
    {
      id: 'cat-electronics',
      name: 'Consumer Electronics & Gadgets',
      slug: 'electronics',
      iconUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100',
      displayOrder: 1,
      level: 0,
      hierarchyPath: '/cat-electronics',
      children: [
        {
          id: 'cat-mobiles-tablets',
          parentId: 'cat-electronics',
          name: 'Mobiles & Smartphones',
          slug: 'smartphones',
          displayOrder: 1,
          level: 1,
          hierarchyPath: '/cat-electronics/cat-mobiles-tablets',
          children: [],
          productCount: 142,
        },
        {
          id: 'cat-audio-headphones',
          parentId: 'cat-electronics',
          name: 'Headphones & Audio',
          slug: 'audio-headphones',
          displayOrder: 2,
          level: 1,
          hierarchyPath: '/cat-electronics/cat-audio-headphones',
          children: [],
          productCount: 89,
        },
        {
          id: 'cat-smartwatches',
          parentId: 'cat-electronics',
          name: 'Smartwatches & Wearables',
          slug: 'wearables',
          displayOrder: 3,
          level: 1,
          hierarchyPath: '/cat-electronics/cat-smartwatches',
          children: [],
          productCount: 64,
        },
      ],
      productCount: 295,
    },
    {
      id: 'cat-himalayan-specialties',
      name: 'Nepal & Himalayan Artisanal Specialties',
      slug: 'himalayan-specialties',
      iconUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=100',
      displayOrder: 2,
      level: 0,
      hierarchyPath: '/cat-himalayan-specialties',
      children: [
        {
          id: 'cat-himalayan-tea',
          parentId: 'cat-himalayan-specialties',
          name: 'Ilam Orthodox Teas & Herbs',
          slug: 'himalayan-tea',
          displayOrder: 1,
          level: 1,
          hierarchyPath: '/cat-himalayan-specialties/cat-himalayan-tea',
          children: [],
          productCount: 48,
        },
        {
          id: 'cat-pashmina-cashmere',
          parentId: 'cat-himalayan-specialties',
          name: 'Authentic Chyangra Pashmina',
          slug: 'pashmina-cashmere',
          displayOrder: 2,
          level: 1,
          hierarchyPath: '/cat-himalayan-specialties/cat-pashmina-cashmere',
          children: [],
          productCount: 76,
        },
        {
          id: 'cat-nepali-handicrafts',
          parentId: 'cat-himalayan-specialties',
          name: 'Singing Bowls & Thangka Art',
          slug: 'singing-bowls-crafts',
          displayOrder: 3,
          level: 1,
          hierarchyPath: '/cat-himalayan-specialties/cat-nepali-handicrafts',
          children: [],
          productCount: 52,
        },
      ],
      productCount: 176,
    },
    {
      id: 'cat-arabian-luxury',
      name: 'Arabian Luxury, Oud & Fragrances',
      slug: 'arabian-luxury',
      iconUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=100',
      displayOrder: 3,
      level: 0,
      hierarchyPath: '/cat-arabian-luxury',
      children: [
        {
          id: 'cat-oud-bakhoor',
          parentId: 'cat-arabian-luxury',
          name: 'Pure Dehn Al Oud & Bakhoor Incense',
          slug: 'oud-bakhoor',
          displayOrder: 1,
          level: 1,
          hierarchyPath: '/cat-arabian-luxury/cat-oud-bakhoor',
          children: [],
          productCount: 92,
        },
        {
          id: 'cat-arabian-dates',
          parentId: 'cat-arabian-luxury',
          name: 'Gourmet Stuffed Dates & Sweets',
          slug: 'gourmet-dates',
          displayOrder: 2,
          level: 1,
          hierarchyPath: '/cat-arabian-luxury/cat-arabian-dates',
          children: [],
          productCount: 38,
        },
        {
          id: 'cat-dubai-fashion',
          parentId: 'cat-arabian-luxury',
          name: 'Designer Abayas & Kaftans',
          slug: 'abayas-kaftans',
          displayOrder: 3,
          level: 1,
          hierarchyPath: '/cat-arabian-luxury/cat-dubai-fashion',
          children: [],
          productCount: 114,
        },
      ],
      productCount: 244,
    },
    {
      id: 'cat-indian-fashion-lifestyle',
      name: 'Indian Ethnic Fashion & Lifestyle',
      slug: 'indian-fashion',
      iconUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100',
      displayOrder: 4,
      level: 0,
      hierarchyPath: '/cat-indian-fashion-lifestyle',
      children: [
        {
          id: 'cat-sarees-lehengas',
          parentId: 'cat-indian-fashion-lifestyle',
          name: 'Banarasi Sarees & Bridal Lehengas',
          slug: 'sarees-lehengas',
          displayOrder: 1,
          level: 1,
          hierarchyPath: '/cat-indian-fashion-lifestyle/cat-sarees-lehengas',
          children: [],
          productCount: 210,
        },
        {
          id: 'cat-mens-kurta',
          parentId: 'cat-indian-fashion-lifestyle',
          name: 'Men Ethnic Kurtas & Sherwanis',
          slug: 'mens-ethnic',
          displayOrder: 2,
          level: 1,
          hierarchyPath: '/cat-indian-fashion-lifestyle/cat-mens-kurta',
          children: [],
          productCount: 88,
        },
      ],
      productCount: 298,
    },
  ];

  async getCategoryTree(): Promise<CategoryNode[]> {
    try {
      const dbCategories = await this.prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });

      if (dbCategories && dbCategories.length > 0) {
        return this.buildTreeFromFlat(dbCategories);
      }
    } catch {
      // Fallback
    }

    return this.mockCategoryTree;
  }

  async getCategoryBySlug(slug: string): Promise<CategoryNode> {
    const tree = await this.getCategoryTree();
    const found = this.findInTree(tree, slug);
    if (!found) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return found;
  }

  private buildTreeFromFlat(flatList: any[]): CategoryNode[] {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    flatList.forEach((c) => {
      map.set(c.id, {
        id: c.id,
        parentId: c.parentId,
        name: c.name,
        slug: c.slug,
        description: c.description,
        iconUrl: c.iconUrl,
        bannerUrl: c.bannerUrl,
        displayOrder: c.displayOrder,
        level: c.level,
        hierarchyPath: c.hierarchyPath,
        children: [],
      });
    });

    flatList.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  private findInTree(nodes: CategoryNode[], slug: string): CategoryNode | null {
    for (const node of nodes) {
      if (node.slug.toLowerCase() === slug.toLowerCase()) return node;
      if (node.children && node.children.length > 0) {
        const found = this.findInTree(node.children, slug);
        if (found) return found;
      }
    }
    return null;
  }
}
