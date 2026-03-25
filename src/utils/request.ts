import {
  GetAlbumsQuery,
  GetAlbumsRes,
  PostAlbumsReq,
  PutAlbumsReq,
} from '$typings/albums';
import { PostImagesRes } from '$typings/images';
import { Response } from '$typings/response';
import { User } from '$typings/user';
import { ApiUrl, baseUrl } from './env';
import axios, { AxiosProgressEvent } from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
});

export const Api = {
  images: {
    post: (
      form: FormData,
      handleProgress?: (p: AxiosProgressEvent) => void
    ) => {
      return instance.post<Response<PostImagesRes>>(ApiUrl.images.root, form, {
        onUploadProgress: handleProgress,
      });
    },
  },
  user: {
    get: () => {
      return instance.get<Response<{ user: User }>>(ApiUrl.user.root);
    },
  },
  albums: {
    post: (postAlbumReq: PostAlbumsReq) => {
      return instance.post<Response<{}>>(ApiUrl.albums.root, postAlbumReq);
    },
    get: (params?: GetAlbumsQuery) => {
      return instance.get<Response<GetAlbumsRes>>(ApiUrl.albums.root, {
        params,
      });
    },
    put: (albumId: string, putAlbumReq: PutAlbumsReq) => {
      return instance.put<Response<{}>>(`${ApiUrl.albums.root}${albumId}`, putAlbumReq);
    },
    delete: (albumId: string) => {
      return instance.delete<Response<{}>>(`${ApiUrl.albums.root}${albumId}`);
    },
  },
};
