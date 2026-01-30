import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ClientService } from 'src/client/client.service';
import { AppointmentStatus } from './enum/appointments.enum';

@Injectable()
export class ServiceService {

  constructor(
      @InjectRepository(Service)
      private readonly serviceRepository: Repository<Service>,
      private readonly clientService: ClientService,
  ) {}

  async create(createServiceDto: CreateServiceDto) {

  const client = await this.clientService.findOne(
    createServiceDto.clientId
  );

  const service = this.serviceRepository.create({
    name: createServiceDto.nameService,
    price: createServiceDto.price,
    starTime: createServiceDto.startTime,
    endTime: createServiceDto.endTime,
    status: createServiceDto.action ?? AppointmentStatus.AGENDAR,
    agendado: client,
  });

  return this.serviceRepository.save(service);
}

  async findAll() {
    const servicos = await this.serviceRepository.find({
      relations: ['agendado', 'cancelado'],
      order: {
        id: 'asc'
      },
      select: {
        agendado: {
          id: true,
          name:true,
        },
        cancelado: {
          id: true,
          name: true,
        }
      }
    })
    return servicos
  }

  async findOne(id: number) {
    const servico = await this.serviceRepository.findOne({
      where: {id},
    })

    if (!servico)
      throw new NotFoundException('Serviço não encontrado')

    return servico;
  }

  
  async update(id: number, updateServiceDto: UpdateServiceDto) {

    const service = await this.findOne(id)

    if (service.status = updateServiceDto?.action ?? AppointmentStatus.CANCELAR) {
        service.status = AppointmentStatus.ABERTO;
    }else {
      service.status = AppointmentStatus.CANCELAR;
    }

    await this.serviceRepository.save(service)
    return service
  }

  async remove(id: number) {
    const servico = await this.serviceRepository.findOne({
      where: {id},
    });

    if (!servico){
      throw new NotFoundException('Serviço não encontrado')
    }
    await this.serviceRepository.remove(servico)
    return servico
  }
}
