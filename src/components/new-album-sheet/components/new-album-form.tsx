import React, { useCallback, useRef, useState } from 'react';
import { Button, Form, Spin, Toast } from '@douyinfe/semi-ui';

import { Api } from '$utils/request';

import UploadArea, { UploadAreaRef } from './upload-area';
import { FormField } from '../typings';

const NewAlbumForm = ({ onExit }: { onExit: () => void }) => {
  const uploadAreaRef = useRef<UploadAreaRef | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = useCallback(async (value: FormField) => {
    setSubmitting(true);
    const loadingToast = Toast.info({
      content: '提交中',
      icon: <Spin />,
    });

    const uploadRes = await uploadAreaRef.current?.upload();

    if (!uploadRes || uploadRes.some(id => !id) || uploadRes.length === 0) {
      setSubmitting(false);
      Toast.close(loadingToast);
      Toast.error('有图片上传失败了哦，请检查一下');
      return;
    }

    const { date, mainArea, subArea, photos } = value;

    const postRes = await Api.albums.post({
      mainArea,
      subArea,
      date: date.toISOString(),
      photos: photos.map((p, i) => ({
        title: p.title,
        description: p.description,
        isPost: p.isPost,
        imageId: uploadRes[i] as string,
      })),
    });

    const postResData = await postRes.json();

    Toast.close(loadingToast);
    setSubmitting(false);

    if (postResData.code !== 0) {
      console.error(postRes, postResData);
      Toast.error('创建失败：' + JSON.stringify(postResData));
    } else {
      Toast.success('创建成功');
      onExit();
    }
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit as any}>
        <Form.DatePicker
          type="date"
          label="日期"
          field="date"
          rules={[{ required: true }]}
        />
        <Form.Input
          label="标题"
          field="mainArea"
          placeholder="如：深圳"
          rules={[{ required: true }]}
        />
        <Form.Input
          label="二级标题"
          field="subArea"
          placeholder="如：深圳湾公园"
          rules={[{ required: true }]}
        />
        <Form.Slot>
          <UploadArea ref={uploadAreaRef} field="photos" label="图片" rules={[{ required: true }]} />
        </Form.Slot>
        <Button
          style={{ marginTop: 24 }}
          type="primary" size="large" htmlType="submit"
          loading={submitting}
        >
          提交
        </Button>
      </Form>
    </>
  );
};

export default NewAlbumForm;
