import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigProvider } from 'src/shared/application/providers/EnvConfigProvider';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (envConfigProvider: EnvConfigProvider) => ({
        uri: envConfigProvider.getDatabaseUri(),
        dbName: envConfigProvider.getDatabaseName(),
        user: envConfigProvider.getDatabaseUser(),
        pass: envConfigProvider.getDatabasePassword(),
        autoIndex: true,
      }),
      inject: [EnvConfigProvider],
    }),
  ],
})
export class DatabaseModule {}
