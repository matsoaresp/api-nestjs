import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";



/*
   Rota de para realizar login
*/
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }



    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.login(loginDto)
        return result
    }
}