import { ExifInfo } from '../../exif/types';

export default class CreatePhotoDto {
  authorId: string;
  hostUrl: string;
  originalName: string;
  exif?: ExifInfo;
}
