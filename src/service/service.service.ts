import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ClientService } from 'src/client/client.service';
import { AppointmentStatus } from './enum/appointments.enum';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@UseGuards(AuthTokenGuard)
@Injectable()
export class ServiceService {

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly clientService: ClientService,
  ) { }

  async create(
    createServiceDto: CreateServiceDto,
    tokenPayload: TokenPayloadDto) {

    const client = await this.clientService.findOne(
      createServiceDto.clientId
    );

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);


    const service = this.serviceRepository.create({
      name: createServiceDto.nameService,
      price: createServiceDto.price,
      startTime,
      endTime,
      status: createServiceDto.action ?? AppointmentStatus.AGENDAR,
      agendado: {id: tokenPayload.sub},
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
          name: true,
        },
        cancelado: {
          id: true,
          name: true,
        }
      }
    })
    return servicos
  }

  async findOne(
    id: number
  ) {
    const servico = await this.serviceRepository.findOne({
      where: { id },
    })

    if(!servico)
      throw new NotFoundException('Serviço não encontrado')

    return servico;
  }


  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    tokenPayload: TokenPayloadDto) {

    const service = await this.findOne(id);

    
    service.status = updateServiceDto.action ?? service.status;

    if(service.status === AppointmentStatus.CANCELAR) {
      service.cancelado = {
        id: updateServiceDto.canceladoId,
      } as any;
    } else {
      service.status = AppointmentStatus.CANCELAR;
    }
    await this.serviceRepository.save(service)
    return service
  }

  async remove(
    id: number,
    tokenPayload:TokenPayloadDto
  ) {
    const servico = await this.serviceRepository.findOne({
      where: { id },
    });

    if(!servico) {
      throw new NotFoundException('Serviço não encontrado')
    }
    await this.serviceRepository.remove(servico)
    return servico
  }
}
