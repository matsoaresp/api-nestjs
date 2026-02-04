import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@UseGuards(AuthTokenGuard)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.serviceService.create(createServiceDto,tokenPayload);
  }

  @Get()
  findAll(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.serviceService.findAll(tokenPayload);
  }

  @Get(':id')
  findOne(
    @Param('id') id: number) {
    return this.serviceService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.serviceService.update(id, updateServiceDto,tokenPayload);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.serviceService.remove(id,tokenPayload);
  }
}
