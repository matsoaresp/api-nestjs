import { Client } from "src/client/entities/client.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppointmentStatus } from "../enum/appointments.enum";

@Entity()
export class Service {


    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    name: string

    @Column({type: 'timestamp'})
    starTime: Date;

    @Column({type: 'timestamp'})
    endTime: Date;

    @Column({type: 'decimal'}) 
    price: number;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.ABERTO
    })
    status: AppointmentStatus;

    @ManyToOne(() => Client, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'agendado'})
    agendado: Client;

    @ManyToOne(() => Client)
    @JoinColumn({name: 'cancelado'})
    cancelado: Client;

}
