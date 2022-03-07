import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteUserRequestDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  id: string;
}
