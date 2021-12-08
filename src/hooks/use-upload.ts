import { PostImagesRes } from '$typings/images';
import { Response } from '$typings/response';
import { cos } from '$utils/cos';
import { Api } from '$utils/request';
import { Toast } from '@douyinfe/semi-ui';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useUpload = (file: File) => {
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const uploadedId = useRef<string | null>(null);

  const handleSuccess = useCallback(() => {
    setUploaded(true);
    setError(false);
    setProgress(100);
  }, []);

  const handleError = useCallback((err: any) => {
    setUploaded(false);
    setError(true);
    setProgress(0);
    Toast.error(JSON.stringify(err));
  }, []);

  const doUpload = useCallback(() => {
    return new Promise<string | null>(async (resolve, reject) => {
      if (uploaded) {
        resolve(uploadedId.current);
        return;
      }

      const res = await Api.images.post(file.name.split('.').pop()!);
      const { data: { bucket, region, path, imageId } }: Response<PostImagesRes> = await res.json();

      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: path,
        StorageClass: 'STANDARD',
        Body: file,
        onProgress: (params => {
          setProgress(params.percent * 100);
        }),
      }, async (err, data) => {
        if (err) {
          handleError(err);
          resolve(null);
          return;
        } else {
          const res = await Api.images.patch(imageId);
          const resObj: Response<{}> = await res.json();
          if (resObj.code === 0) {
            handleSuccess();
            uploadedId.current = imageId;
            resolve(imageId);
          } else {
            handleError(resObj);
            resolve(null);
          }
        }
      });
    })

  }, [file, uploaded]);

  useEffect(() => {
    return () => {
      setUploaded(false);
      setProgress(0);
      setError(false);
    };
  }, [file]);

  return <const>[doUpload, uploaded, error, progress];
};
