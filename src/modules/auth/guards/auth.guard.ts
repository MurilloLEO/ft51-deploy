import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //* Obtenemos el contexto de ejecucion:
    const request = context.switchToHttp().getRequest();

    //* Extraer el token desde Headers:
    //* me llega en Authorization Bearer: TOKEN...
    const token = request.headers.authorization?.split(' ')[1];
    if(!token) throw new UnauthorizedException('Se necesita token');

    try {
      //* Validacion de Token:
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret });
      if(!user) {
        throw new UnauthorizedException('Error al validar Token');
      }

      //* Adjuntar fecha de expiración:
      user.exp = new Date(user.exp * 1000);
      user.roles = user.isAdmin? [Role.Admin] : [Role.User];
      
      //* en el request que saque me guardo a todo el usuario asi lo lleva
      request.user = user;

      return true;

    } catch (error) {
      throw new UnauthorizedException('Error al validar Token');
    }
  }
}
