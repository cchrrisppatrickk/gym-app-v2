import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return result;
            }
        }
        throw new UnauthorizedException('Credenciales incorrectas');
    }

    async login(user: any) {
        const payload = { sub: user.id, roleId: user.roleId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
