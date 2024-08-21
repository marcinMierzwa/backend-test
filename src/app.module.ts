import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
        signOptions: {expiresIn: '30s'},
      }),
      global:true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connnectionString')
      }),
      inject: [ConfigService]
    }), 
    AuthModule, ProductsModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
