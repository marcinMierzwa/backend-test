export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    isEmailAdressConfirmed: boolean,
    message: string,
}