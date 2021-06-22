import { ExifDto } from './exif.dto';

export default class CreatePhotoDto {
  authorId: string;
  authorLogin: string;
  hostUrl: string;
  originalName: string;
  exif?: ExifDto;
}
