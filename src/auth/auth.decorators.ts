import { UseGuards, createParamDecorator } from '@nestjs/common';
import JwtAuthGuard from './jwt-auth.guard';

export const ForAuthorized = () => UseGuards(JwtAuthGuard);
export const GetUser = createParamDecorator((_data, req) => req.args[0].user);
