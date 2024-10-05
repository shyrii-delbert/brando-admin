import { Api } from '$utils/request';
import { Toast } from '@douyinfe/semi-ui';
import { AxiosProgressEvent } from 'axios';
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

      const form = new FormData();
      form.set('image', file);

      const handleProgress = (progress: AxiosProgressEvent) => {
        setProgress((progress.rate || 0) * 100);
      };

      try {
        const res = await Api.images.post(form, handleProgress);

        handleSuccess();
        uploadedId.current = res.data.data.imageId;
        resolve(res.data.data.imageId);
      } catch (err) {
        handleError(err);
        resolve(null);
      }
    });
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
