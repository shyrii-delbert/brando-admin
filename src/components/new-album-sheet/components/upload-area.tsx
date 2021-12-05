import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { Card, Upload, withField } from '@douyinfe/semi-ui';

import { PhotoField } from '../typings';
import PhotoItem, { PhotoItemFieldValue, PhotoItemRef } from './photo-item';

interface UploadAreaProps {
  onChange?(e: { value: PhotoField[] }): void;
}

const UploadArea = ({ onChange }: UploadAreaProps) => {
  const [photos, setPhotos] = useState<PhotoField[]>([]);
  const photoItemRefs = useRef<(PhotoItemRef | null)[]>([]);

  const handleFileChange = useCallback((files: File[]) => {
    const targetFiles = files.filter(f => !photos.find(p => p.imageFile.name === f.name));
    if (targetFiles.length) {
      setPhotos([...photos, ...targetFiles.map(f => ({ imageFile: f, title: '', description: '' }))]);
    }
  }, [photos]);

  const handleRemove = useCallback((index: number) => {
    setPhotos(photos => {
      const newPhotos = [...photos];
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  }, []);

  useEffect(() => {
    photoItemRefs.current = photoItemRefs.current.slice(0, photos.length);
    onChange?.({ value: photos });
  }, [photos]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }

    setPhotos(photos => {
      const newPhotos = [...photos];
      const [removed] = newPhotos.splice(result.source.index, 1);
      newPhotos.splice(result.destination!.index, 0, removed);
      return newPhotos;
    });
  }, []);

  const handleChange = useCallback((value: PhotoItemFieldValue, index: number) => {
    setPhotos(photos => {
      const newPhotos = [...photos];
      newPhotos[index] = {
        ...newPhotos[index],
        ...value,
      };
      return newPhotos;
    });
  }, []);

  return (
    <Card
      style={{ width: '100%', backgroundColor: 'inherit', marginTop: 12 }}
    >
      <Upload
        action=""
        uploadTrigger="custom"
        onFileChange={f => handleFileChange(f)}
        draggable={true}
        dragMainText={'点击上传文件或拖拽文件到这里'}
        dragSubText="支持 .png, .jpeg, .jpg, .bmp, .webp 类型"
        accept=".png,.jpeg,.jpg,.bmp,.webp"
        fileList={[]}
        multiple
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {photos.map((p, i) => (
                <PhotoItem
                  key={p.imageFile.name}
                  index={i}
                  photoField={p}
                  onRemove={handleRemove}
                  onChange={handleChange}
                  ref={ref => photoItemRefs.current[i] = ref}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
};

export default withField(UploadArea, { valueKey: 'value', onKeyChangeFnName: 'onChange', valuePath: 'value' });
