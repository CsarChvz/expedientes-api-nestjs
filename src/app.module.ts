/* eslint-disable @typescript-eslint/require-await */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostsModule } from "./posts/posts.module";
import { CommonModule } from "./common/common.module";
import { QueueModule } from "./module/queue/queue.module";
import { CronModule } from "./module/cron/cron.module";
import { BullModule } from "@nestjs/bullmq";
import { DataModule } from "./module/data/data.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>("redis.host", "localhost"),
          port: configService.get<number>("redis.port", 6379),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
          removeOnComplete: true,
        },
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    CommonModule,
    QueueModule,
    CronModule,
    DataModule,
  ],
})
export class AppModule {}
