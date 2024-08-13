import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
