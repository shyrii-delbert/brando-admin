import React, { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Card, Form, Row } from '@douyinfe/semi-ui';
import { IconMinusCircle } from '@douyinfe/semi-icons';
import { PhotoField } from '../typings';
import * as Styled from './styled';

interface PhotoItemProps {
  index: number;
  photoField: PhotoField,
  onRemove: (index: number) => void;
}

export interface PhotoItemRef {
  getIndex: () => number;
  upload: () => Promise<string>;
}

const PhotoItem = (props: PhotoItemProps, ref: ForwardedRef<PhotoItemRef>) => {
  const { photoField, index, onRemove } = props;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  useImperativeHandle(ref, () => ({
    getIndex: () => index,
    upload: () => Promise.resolve(''),
  }), [index]);

  useEffect(() => {
    const url = URL.createObjectURL(photoField.imageFile);
    setImgSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photoField])

  return (
    <Draggable draggableId={photoField.imageFile.name} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            style={{ backgroundColor: 'var(--semi-color-bg-2)', marginTop: 24 }}
          >
            <Row type="flex" justify="space-between" style={{ flexWrap: 'nowrap' }}>
              <Row type="flex" style={{ width: '100%', flexWrap: 'nowrap' }}>
                <Styled.PreviewImage src={imgSrc!} />
                <Form style={{ marginLeft: 16, width: '100%' }}>
                  <Form.Input fieldStyle={{ paddingTop: 0 }} field="title" label="标题" rules={[{ required: true }]} placeholder="茶颜悦色打卡中" />
                  <Form.TextArea field="title" label="描述" rules={[{ required: true }]} placeholder="这是一杯不错的奶茶..." />
                </Form>
              </Row>
              <Button style={{ marginLeft: 6 }} type='danger' theme='borderless' icon={<IconMinusCircle />} onClick={handleRemove} />
            </Row>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default forwardRef<PhotoItemRef, PhotoItemProps>(PhotoItem);
