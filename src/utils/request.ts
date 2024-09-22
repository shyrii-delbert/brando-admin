import { PostAlbumsReq } from '$typings/albums';
import { ApiUrl } from './env';

export const Api = {
  images: {
    authorize: () => {
      return fetch(ApiUrl.images.authorize);
    },
    post: (imageType: string) => {
      return fetch(ApiUrl.images.root, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageType }),
      });
    },
    patch: (imageId: string) => {
      return fetch(ApiUrl.images.root + `${imageId}`, {
        method: 'PATCH',
      });
    },
  },
  user: {
    get: () => {
      return fetch(ApiUrl.user.root, {
        credentials: 'include',
      });
    },
  },
  albums: {
    post: (postAlbumReq: PostAlbumsReq) => {
      return fetch(ApiUrl.albums.root, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postAlbumReq),
      });
    },
  },
};
