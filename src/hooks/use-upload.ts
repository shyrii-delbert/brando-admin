import { useCallback, useEffect, useRef, useState } from 'react';

export const useUpload = (file: File) => {
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const uploadedId = useRef<string | null>(null);

  const doUpload = useCallback(async () => {
    if (uploaded) {
      return uploadedId.current;
    }
    
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
