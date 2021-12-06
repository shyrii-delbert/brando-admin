import { GetImageAuthorizeRes } from '$typings/images';
import { Response } from '$typings/response';
import COS from 'cos-js-sdk-v5';
import { Api } from './request';

export const cos = new COS({
  getAuthorization: async (options, callback) => {
    const res = await Api.images.authorize()
    const { data }: Response<GetImageAuthorizeRes> = await res.json();
    callback({
      TmpSecretId: data.tmpSecretId,
      TmpSecretKey: data.tmpSecretKey,
      SecurityToken: data.sessionToken,
      StartTime: data.startTime,
      ExpiredTime: data.expiredTime,
    });
  }
});
