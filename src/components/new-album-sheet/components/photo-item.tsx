import React, { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Card, Checkbox, Col, Form, Progress, Row } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconTickCircle, IconUploadError } from '@douyinfe/semi-icons';
import { PhotoField } from '../typings';
import * as Styled from './styled';
import { useUpload } from '$hooks/use-upload';
import { CheckboxEvent } from '@douyinfe/semi-ui/lib/es/checkbox';

interface PhotoItemProps {
  index: number;
  photoField: PhotoField,
  onRemove: (index: number) => void;
  onChange: (value: PhotoItemFieldValue, index: number) => void;
  onIsPostChange: (isPost: boolean, index: number) => void;
}

export interface PhotoItemFieldValue { title: string, description: string }

export interface PhotoItemRef {
  upload: () => Promise<string | null>;
}

const PhotoItem = (props: PhotoItemProps, ref: ForwardedRef<PhotoItemRef>) => {
  const { photoField, index, onRemove, onChange, onIsPostChange } = props;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [doUpload, uploaded, error, progress] = useUpload(photoField.imageFile);

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

  const handleIsPostChange = useCallback((e: CheckboxEvent) => {
    onIsPostChange(!!e.target.checked, index);
  }, [index, onIsPostChange]);

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
                  {error && <IconUploadError style={{ marginTop: 16, color: 'var(--semi-color-danger)' }} />}
                  {!uploaded && progress > 0 && <Progress style={{ marginTop: 16 }} percent={progress} showInfo={true} />}
                </Col>
                <Row style={{ marginLeft: 16, width: '100%' }}>
                  <Form onValueChange={handleValueChange as any}>
                    <Form.Input fieldStyle={{ paddingTop: 0 }} field="title" label="标题" rules={[{ required: true }]} placeholder="茶颜悦色打卡中" />
                    <Form.TextArea field="description" label="描述" rules={[{ required: true }]} placeholder="这是一杯不错的奶茶..." />
                  </Form>
                  <Checkbox onChange={handleIsPostChange} checked={photoField.isPost}>设置为封面</Checkbox>
                </Row>
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
