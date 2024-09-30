import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";
import googleAuthConfig from "src/config/google.auth.config";
import { AuthService } from "./auth.service";




@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(googleAuthConfig.KEY) private googleConfiguration: ConfigType<typeof googleAuthConfig>,
        private authService: AuthService,
    ) {
        super({
            clientID: googleConfiguration.clientId,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL:googleConfiguration.callbackURL,
            scope:["email", "profile"],

        })
    }

    async validate(accessToken:string, refreshToken:string, profile:Profile, done:VerifiedCallback) {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const avatar = profile.photos[0].value;
        const user = await this.authService.validateGoogleUser(
            email, googleId, avatar
        );
        done(null, user)
    }
}