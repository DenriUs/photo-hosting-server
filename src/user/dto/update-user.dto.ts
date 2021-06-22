import { Photo } from 'src/photo/shemas/photo.schema';

export default class UpdateUserDto {
  readonly id: string;
  readonly profilePhoto: Photo;
  readonly backgroundPhoto: Photo;
}
