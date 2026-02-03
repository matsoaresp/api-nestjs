import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {

  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {

  }
  
  async create(createClientDto: CreateClientDto) {
    const clientData = {
      name: createClientDto.name,
      email: createClientDto.email,
      password: createClientDto.password,
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

  async update(id: number, updateClientDto: UpdateClientDto) {

    const client = await this.clientRepository.preload({
      id,
      name: updateClientDto?.name,
      email: updateClientDto?.email,
      password: updateClientDto?.password
    })

    if (!client)
      throw new NotFoundException('Client não encontrado')
    
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
