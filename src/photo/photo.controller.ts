import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { ForAuthorized, GetUser } from '../auth/auth.decorators';
import { PhotoDocument } from './shemas/photo.schema';
import { ExifDto } from './dto/exif.dto';
import CreatePhotoDto from './dto/create-photo.dto';
import { UserDocument } from '../user/schemas/user.schema';
import AzureStorageService from '../azure-storage/azure-storage.service';
import UpdatePhotoDto from './dto/update-photo.dto';

@ForAuthorized()
@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  async upload(
    @GetUser() currentUser: UserDocument,
    @UploadedFile() photo: Express.Multer.File,
    @Body() exifData: ExifDto,
  ): Promise<PhotoDocument> {
    const azureStorageContainerName = currentUser.azureStorageContainerName;
    const isUploaded = await this.azureStorageService.tryUploadFile(
      photo,
      azureStorageContainerName,
    );
    if (!isUploaded) {
      throw new InternalServerErrorException();
    }
    const newPhoto = new CreatePhotoDto();
    newPhoto.authorId = currentUser.id;
    newPhoto.originalName = photo.originalname;
    const PhotoContainer = `${process.env.AZURE_STORAGE_ACCOUNT_URL}/${azureStorageContainerName}`;
    newPhoto.hostUrl = `${PhotoContainer}/${photo.originalname}`;
    const parsedExifData = JSON.parse(JSON.stringify(exifData));
    for (const exifField of Object.keys(parsedExifData)) {
      if (parsedExifData[exifField] === 'undefined') {
        parsedExifData[exifField] = null;
      }
    }
    newPhoto.exif = parsedExifData;
    if (!newPhoto.exif) {
      newPhoto.exif.creationDate = new Date().toISOString();
    }
    return await this.photoService.create(newPhoto);
  }

  @Get('getOwnPhotos')
  async getOwnPhotos(@GetUser() currentUser: UserDocument): Promise<PhotoDocument[]> {
    return await this.photoService.getAllByUserId(currentUser.id);
  }

  @Post('update')
  async update(@Body() updatePhotoDto: UpdatePhotoDto): Promise<PhotoDocument> {
    return await this.photoService.update(updatePhotoDto);
  }
}
