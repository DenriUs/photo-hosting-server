import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { ForAuthorized, GetUser } from '../auth/auth.decorators';
import { Photo, PhotoDocument } from './shemas/photo.schema';
import { ExifDto } from './dto/exif.dto';
import CreatePhotoDto from './dto/create-photo.dto';
import { UserDocument } from '../user/schemas/user.schema';
import AzureStorageService from '../azure-storage/azure-storage.service';
import UpdatePhotoDto from './dto/update-photo.dto';
import UserService from 'src/user/user.service';
import FavoriteDto from './dto/favorite.dto';

@ForAuthorized()
@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly userService: UserService,
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

  @Post('addFavorite')
  async addFavorite(@Body() addFavoriteDto: FavoriteDto): Promise<Photo> {
    await this.userService.addFavorite(addFavoriteDto);
    return await this.photoService.getById(addFavoriteDto.favoritePhotoId);
  }

  @Post('removeFavorite')
  async removeFavorite(@Body() removeFavoriteDto: FavoriteDto): Promise<string> {
    await this.userService.removeFavorite(removeFavoriteDto);
    return removeFavoriteDto.favoritePhotoId
  }

  @Get('getOwnPhotos')
  async getOwnPhotos(@GetUser() currentUser: UserDocument): Promise<PhotoDocument[]> {
    return await this.photoService.getAllOwnByUserId(currentUser.id);
  }

  @Get('getFavoritePhotos')
  async getFavoritePhotos(@GetUser() currentUser: UserDocument): Promise<Photo[]> {
    return await this.userService.getAllFavoriteByUserId(currentUser.id);
  }

  @Post('update')
  async update(@Body() updatePhotoDto: UpdatePhotoDto): Promise<PhotoDocument> {
    return await this.photoService.update(updatePhotoDto);
  }
}
