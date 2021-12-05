import { useCallback, useEffect, useState } from 'react';

export const useUpload = (file: File) => {
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const doUpload = useCallback(async () => {
    return '';
  }, [file]);

  useEffect(() => {
    return () => {
      setUploaded(false);
      setProgress(0);
    };
  }, [file]);

  return <const>[doUpload, uploaded, progress];
};
