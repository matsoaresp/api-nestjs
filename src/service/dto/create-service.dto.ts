import { IsBoolean, IsEnum, isNotEmpty, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from "class-validator";
import { AppointmentStatus } from "../enum/appointments.enum";

export class CreateServiceDto {

    @IsString()
    @IsNotEmpty() 
    nameService: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    startTime: Date;

    @IsNotEmpty()
    endTime: Date;

    @IsNotEmpty()
    clientId: number

    @IsEnum(AppointmentStatus)
    action: AppointmentStatus;

    @IsNumber()
    canceladoId?: number;
}
