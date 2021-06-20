import { ExifDto } from './exif.dto';

export default class CreatePhotoDto {
  authorId: string;
  hostUrl: string;
  originalName: string;
  exif?: ExifDto;
}
