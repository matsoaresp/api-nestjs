import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(
    @Param('id') id: number) {
    return this.clientService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto, 
    tokenPayload:TokenPayloadDto) {
    return this.clientService.update(id, updateClientDto, tokenPayload);
  }


  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param('id') id: number) {
    return this.clientService.remove(id);
  }
}
