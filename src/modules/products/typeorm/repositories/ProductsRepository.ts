import { EntityRepository, Repository } from 'typeorm';
import Product from '../entities/product';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async findByName(name: string): Promise<Product | undefined> {
    const Product = this.findOne({
      where: {
        name,
      },
    });

    return Product;
  }
}
