import { ApiUrl } from './env';

export const Api = {
  images: {
    authorize: async () => {
      return await fetch(ApiUrl.images.authorize);
    },
    post: async (imageType: string) => {
      return await fetch(ApiUrl.images.root, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageType }),
      });
    },
    patch: async (imageId: string) => {
      return await fetch(ApiUrl.images.root, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId }),
      });
    },
  }
};
