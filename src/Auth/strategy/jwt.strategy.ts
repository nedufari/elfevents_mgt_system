import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AdminService } from "../../users/admin/admin.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
   constructor(configservice:ConfigService,
    private readonly adminservice: AdminService,){
    super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:configservice.get('SECRETKEY')
    })
   }

   async validate(payload: any, done: VerifiedCallback) {
    try {
      const { sub: id, email, role } = payload;

      //console.log('JwtStrategy - Validating user with id:', id, 'email:', email, 'role:', role);
      
      const user = await this.adminservice.validateuserbyId(id, role);
  
      if (!user) {
        return done(new UnauthorizedException('Invalid token'), false);
      }
  
      user.role = role;
      user.email = email;

      //console.log('JwtStrategy - User validated:', user);
  
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
   
}

