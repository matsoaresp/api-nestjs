import { IsBoolean, IsEnum, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { AppointmentStatus } from "../enum/appointments.enum";

export class CreateServiceDto {

    @IsString()
    @IsNotEmpty() 
    nameService: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNumber()
    @IsOptional()
    clientId?: number

    
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    action: AppointmentStatus;

    @IsOptional()
    @IsNumber()
    canceladoId?: number;
}
