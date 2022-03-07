
export class GenericUserResposeDto {
  user: UserResposeDto;
  token: string;
}

export class UserResposeDto {
  name: string;
  email: string;
  theme: string;
}
