import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import AzureStorageService from '../azureStorage/azureStorage.service';
import { ForAuthorized, GetUser } from 'src/auth/auth.decorators';
import CreatePhotoDto from './dto/create-photo.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Photo, PhotoDocument } from './shemas/photo.schema';

@ForAuthorized()
@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @GetUser() currentUser: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Photo> {
    const azureStorageContainerName = currentUser.azureStorageContainerName;
    const isUploaded = await this.azureStorageService.tryUploadFile(
      file,
      azureStorageContainerName,
    );
    if (!isUploaded) {
      throw new InternalServerErrorException();
    }
    const newPhoto = new CreatePhotoDto();
    newPhoto.authorId = currentUser.id;
    newPhoto.creationTimestamp = Date.now();
    const fileContainer = `${process.env.AZURE_STORAGE_ACCOUNT_URL}/${azureStorageContainerName}`;
    newPhoto.hostUrl = `${fileContainer}/${file.originalname}`;
    return await this.photoService.create(newPhoto);
  }

  @Get('getOwnPhotos')
  async getOwnPhotos(@GetUser() currentUser: UserDocument): Promise<PhotoDocument[]> {
    return await this.photoService.getAllByUserId(currentUser.id);
  }
}
