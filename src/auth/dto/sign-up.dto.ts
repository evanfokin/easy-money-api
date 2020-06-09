import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(5)
  password: string;
}
