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
import PhotoService from './photo.service';
import { ForAuthorized, GetUser } from '../auth/auth.decorators';
import { Photo, PhotoDocument } from './shemas/photo.schema';
import { ExifDto } from './dto/exif.dto';
import { UserDocument } from '../user/schemas/user.schema';
import AzureStorageService from '../azure-storage/azure-storage.service';
import UpdatePhotoDto from './dto/update-photo.dto';
import UserService from 'src/user/user.service';
import FavoritePhotoDto from './dto/favorite-photo.dto';
import AccessedPhotoDto from './dto/accessed-photo.dto';

@ForAuthorized()
@Controller('photo')
export default class PhotoController {
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
    await this.uploadPhotoToAzure(azureStorageContainerName, photo);
    const photoContainer = `${process.env.AZURE_STORAGE_ACCOUNT_URL}/${currentUser.azureStorageContainerName}`;
    const newPhoto = this.photoService.preparePhotoToSave(
      currentUser,
      photo,
      photoContainer,
      exifData,
    );
    return await this.photoService.create(newPhoto);
  }

  @Post('updateProfilePhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @GetUser() currentUser: UserDocument,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<UserDocument> {
    const azureStorageContainerName = currentUser.azureStorageContainerName;
    await this.uploadPhotoToAzure(azureStorageContainerName, photo);
    const photoContainer = `${process.env.AZURE_STORAGE_ACCOUNT_URL}/${currentUser.azureStorageContainerName}`;
    currentUser.profilePhotoUrl = `${photoContainer}/${photo.originalname}`;
    return await this.userService.update(currentUser);
  }

  @Post('updateBackgroundPhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async updateBackgroundPhoto(
    @GetUser() currentUser: UserDocument,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<UserDocument> {
    const azureStorageContainerName = currentUser.azureStorageContainerName;
    await this.uploadPhotoToAzure(azureStorageContainerName, photo);
    const photoContainer = `${process.env.AZURE_STORAGE_ACCOUNT_URL}/${currentUser.azureStorageContainerName}`;
    currentUser.backgroundPhotoUrl = `${photoContainer}/${photo.originalname}`;
    return await this.userService.update(currentUser);
  }

  @Post('addFavorite')
  async addFavorite(@Body() addFavoriteDto: FavoritePhotoDto): Promise<Photo> {
    await this.userService.addFavorite(addFavoriteDto);
    return await this.photoService.getById(addFavoriteDto.favoritePhotoId);
  }

  @Post('addAccessed')
  async addAccessed(
    @Body() addAccessedDto: AccessedPhotoDto,
  ): Promise<PhotoDocument> {
    await this.userService.addAccessed(addAccessedDto);
    return await this.photoService.makeShared(addAccessedDto.accessedPhotoId);
  }

  @Post('removeFavorite')
  async removeFavorite(
    @Body() removeFavoriteDto: FavoritePhotoDto,
  ): Promise<string> {
    await this.userService.removeFavorite(removeFavoriteDto);
    return removeFavoriteDto.favoritePhotoId;
  }

  @Get('getOwnPhotos')
  async getOwnPhotos(
    @GetUser() currentUser: UserDocument,
  ): Promise<PhotoDocument[]> {
    return await this.photoService.getAllOwnByUserId(currentUser.id);
  }

  @Get('getFavoritePhotos')
  async getFavoritePhotos(
    @GetUser() currentUser: UserDocument,
  ): Promise<Photo[]> {
    return await this.userService.getAllFavoriteByUserId(currentUser.id);
  }

  @Get('getAccessedPhotos')
  async getAccessedPhotos(
    @GetUser() currentUser: UserDocument,
  ): Promise<Photo[]> {
    return await this.userService.getAllAccessedByUserId(currentUser.id);
  }

  @Post('update')
  async update(@Body() updatePhotoDto: UpdatePhotoDto): Promise<PhotoDocument> {
    return await this.photoService.update(updatePhotoDto);
  }

  private async uploadPhotoToAzure(
    azureStorageContainerName: string,
    photo: Express.Multer.File,
  ) {
    const isUploaded = await this.azureStorageService.tryUploadFile(
      photo,
      azureStorageContainerName,
    );
    if (!isUploaded) {
      throw new InternalServerErrorException();
    }
  }
}
