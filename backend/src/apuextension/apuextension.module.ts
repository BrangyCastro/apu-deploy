import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApuextensionController } from './apuextension.controller';
import { ApuextensionService } from './apuextension.service';
import { ApuExtensionRepository } from './apuextension.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApuExtensionRepository]), UserModule],
  controllers: [ApuextensionController],
  providers: [ApuextensionService],
})
export class ApuextensionModule {}
