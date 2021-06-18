import { Controller, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import AzureStorageService from '../azureStorage/azureStorage.service';
import { ForAuthorized, GetUser } from 'src/auth/auth.decorators';

@ForAuthorized()
@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@GetUser() currentUser, @UploadedFile() file: Express.Multer.File):Promise<string> {
    const isUploaded = await this.azureStorageService.tryUploadFile(
      file,
      currentUser.azureStorageContainerName,
    );
    if (!isUploaded) {
      throw new InternalServerErrorException();
    }
    return 'uploaded';
  }
}
