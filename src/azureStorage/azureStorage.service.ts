import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export default class AzureStorageService {
  private getBlobServiceClient(): BlobServiceClient {
    return BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  }

  public async tryCreateContainer(containerName: string): Promise<boolean> {
    const blobServiceClient = this.getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    try {
      const response = await containerClient.create({ access: 'container' });
      if (response.errorCode) return false;
      return true;
    } catch {
      return false;
    }
  }

  public async tryUploadFile(file: Express.Multer.File, containerName: string) {
    const blobClientService = this.getBlobServiceClient();
    const containerClient = blobClientService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(file.originalname);
    try{
      const response = await blobClient.uploadData(file.buffer);
      if (response.errorCode) return false;
      return true;
    } catch {
      return false;
    }
    
  }

}
