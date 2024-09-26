import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";
import googleAuthConfig from "src/config/google.auth.config";




@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(googleAuthConfig.KEY) private googleConfiguration: ConfigType<typeof googleAuthConfig>
    ) {
        super({
            clientID: googleConfiguration.clientId,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL:googleConfiguration.callbackURL,
            scope:["email", "profile"],
        })
    }

    async validate(accessToken:string, refreshToken:string, profile:any, done:VerifiedCallback) {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const avatar = profile.photos[0].value;
        
    }
}