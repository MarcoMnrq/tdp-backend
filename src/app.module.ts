import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // TypeORM Module (Database)
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? {
            type: 'mysql',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'test',
            autoLoadEntities: true,
            synchronize: true,
          },
    ),
    // Throttler and Event Emitter Modules
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    // Other Modules
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
