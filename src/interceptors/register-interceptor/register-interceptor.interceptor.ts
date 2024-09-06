import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';


@Injectable()
export class RegisterInterceptorInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
// Pobranie parametrów z URL (parametry routingu)
const emailConfirmationToken = request.query.token;

if(!emailConfirmationToken) {
  throw new UnauthorizedException('Invalid token');
}
try {
  const payload = this.jwtService.verify(emailConfirmationToken);
  request.userId = payload._id;
  
  
}
catch(err) {
  Logger.error(err.message);
  throw new UnauthorizedException('Invalid token');
}

    return next.handle();

  }
}


