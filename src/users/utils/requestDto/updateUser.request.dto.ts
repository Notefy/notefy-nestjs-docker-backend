import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  theme: string;

  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  id: string;
}
