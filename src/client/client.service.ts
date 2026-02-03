import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class ClientService {

  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly hashingService: HashingService
  ) {

  }
  
  async create(createClientDto: CreateClientDto) {

    const passwordHash = await this.hashingService.hash(
      createClientDto.password,
    );

    const clientData = {
      name: createClientDto.name,
      email: createClientDto.email,
      password: passwordHash,
    }

    const newClient = await this.clientRepository.create(clientData)
    await this.clientRepository.save(newClient);
    return newClient;

  }
  async findAll() {
    const clients = await this.clientRepository.find ({
      order: {
        id: 'asc'
      },
    });

    return clients
  }
  async findOne(id: number) {

    const client = await this.clientRepository.findOne({
      where: {id},
    });

    if (!client) 
      throw new NotFoundException('Client não encontrado!')

    return client
  }

  async update(id: number,
     updateClientDto: UpdateClientDto,
     tokenPayload: TokenPayloadDto
    ) {

    const dadosClient = {
      name: updateClientDto?.name,
    }

    if (updateClientDto?.password){
      const passwordHash = await this.hashingService.hash(
        updateClientDto.password
      );

      dadosClient['passwordHash'] = passwordHash
    }

    const client = await this.clientRepository.preload({
      id,
      name: updateClientDto?.name,
      email: updateClientDto?.email,
    })

    if (!client)
      throw new NotFoundException('Client não encontrado')

    if (client.id !== tokenPayload.sub){
      throw new ForbiddenException('Você não é essa pessoa')
    }
    
    return this.clientRepository.save(client)
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOne({
      where: {id}
    });
    
    if (!client) 
      throw new NotFoundException('Cliente não encontrado')
    return this.clientRepository.remove(client)
  }
}
