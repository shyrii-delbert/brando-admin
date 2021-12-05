import React, { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Card, Col, Form, Progress, Row } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconTickCircle } from '@douyinfe/semi-icons';
import { PhotoField } from '../typings';
import * as Styled from './styled';
import { useUpload } from '$hooks/use-upload';

interface PhotoItemProps {
  index: number;
  photoField: PhotoField,
  onRemove: (index: number) => void;
  onChange: (value: PhotoItemFieldValue, index: number) => void;
}

export interface PhotoItemFieldValue { title: string, description: string }

export interface PhotoItemRef {
  upload: () => Promise<string>;
}

const PhotoItem = (props: PhotoItemProps, ref: ForwardedRef<PhotoItemRef>) => {
  const { photoField, index, onRemove, onChange } = props;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [doUpload, uploaded, progress] = useUpload(photoField.imageFile);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  useImperativeHandle(ref, () => ({
    upload: doUpload,
  }), [index, doUpload]);

  useEffect(() => {
    const url = URL.createObjectURL(photoField.imageFile);
    setImgSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photoField.imageFile])

  const handleValueChange = useCallback((value: PhotoItemFieldValue) => {
    onChange(value, index);
  }, [index, onChange]);

  return (
    <Draggable draggableId={photoField.imageFile.name} index={index}>
      {provided => (
        <Styled.DragContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            style={{ backgroundColor: 'var(--semi-color-bg-2)', marginTop: 24 }}
          >
            <Row type="flex" justify="space-between" style={{ flexWrap: 'nowrap' }}>
              <Row type="flex" style={{ width: '100%', flexWrap: 'nowrap' }}>
                <Col>
                  <Styled.PreviewImage src={imgSrc!} />
                  {uploaded && <IconTickCircle style={{ marginTop: 16, color: 'var(--semi-color-primary)' }} />}
                  {!uploaded && progress > 0 && <Progress style={{ marginTop: 16 }} percent={progress} showInfo={true} />}
                </Col>
                <Form style={{ marginLeft: 16, width: '100%' }} onValueChange={handleValueChange as any}>
                  <Form.Input fieldStyle={{ paddingTop: 0 }} field="title" label="标题" rules={[{ required: true }]} placeholder="茶颜悦色打卡中" />
                  <Form.TextArea field="description" label="描述" rules={[{ required: true }]} placeholder="这是一杯不错的奶茶..." />
                </Form>
              </Row>
              <Button style={{ marginLeft: 6 }} type='danger' theme='borderless' icon={<IconMinusCircle />} onClick={handleRemove} />
            </Row>
          </Card>
        </Styled.DragContainer>
      )}
    </Draggable>
  );
};

export default forwardRef<PhotoItemRef, PhotoItemProps>(PhotoItem);
