import { ImageModel } from './images';
import { PhotoModel } from './photos';

export interface AlbumModel {
  id?: string;
  date: string;
  mainArea: string;
  subArea: string;
}

interface PhotoParam extends Omit<PhotoModel, 'id'> {
  imageId: string;
}

export interface PostAlbumsReq extends Omit<AlbumModel, 'id'> {
  photos: PhotoParam[];
}

export interface PutAlbumsReq extends Omit<AlbumModel, 'id'> {
  photos: PhotoParam[];
}

export type AlbumRes = AlbumModel & {
  photos: (PhotoModel & {
    image: ImageModel;
  })[];
};

export interface GetAlbumsQuery {
  query?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface GetAlbumsRes {
  albums: AlbumRes[];
  total: number;
}
