import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['INTERN', 'ENGINEER', 'ADMIN'], {
    message: 'Role must be one of INTERN, ENGINEER, or ADMIN',
  })
  role: 'INTERN' | 'ENGINEER' | 'ADMIN';
}
