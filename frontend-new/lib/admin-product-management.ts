/**
 * Admin Product Management System
 *
 * Product catalog management for administrators
 */

export interface AdminProduct {
  id: string;
  name: string;
  status: 'draft' | 'pending_review' | 'active' | 'inactive' | 'out_of_stock';
  price: number;
  category: string;
  artisanId: string;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export class AdminProductManagementSystem {
  private products: Map<string, AdminProduct> = new Map();

  async getProduct(id: string): Promise<AdminProduct | null> {
    return this.products.get(id) || null;
  }

  async searchProducts(query: {
    status?: string;
    category?: string;
    limit?: number;
  }): Promise<AdminProduct[]> {
    let results = Array.from(this.products.values());
    if (query.status) results = results.filter((p) => p.status === query.status);
    if (query.category) results = results.filter((p) => p.category === query.category);
    if (query.limit) results = results.slice(0, query.limit);
    return results;
  }

  async approveProduct(id: string, adminId: string): Promise<AdminProduct> {
    const product = this.products.get(id);
    if (!product) throw new Error('Product not found');
    product.status = 'active';
    product.approvedBy = adminId;
    product.approvedAt = new Date();
    this.products.set(id, product);
    return product;
  }

  async getAnalytics(): Promise<{ total: number; byStatus: Record<string, number> }> {
    const products = Array.from(this.products.values());
    const byStatus = products.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return { total: products.length, byStatus };
  }
}

export const adminProductManagementSystem = new AdminProductManagementSystem();
