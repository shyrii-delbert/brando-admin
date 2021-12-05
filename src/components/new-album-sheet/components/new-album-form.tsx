import React, { useState } from 'react';

import { Button, Form, TextArea } from '@douyinfe/semi-ui';
import UploadArea from './upload-area';

const NewAlbumForm = () => {
  const [value, setValue] = useState<any>({});

  return (
    <>
      <Form onSubmit={setValue}>
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
          <UploadArea field="photos" label="图片" rules={[{ required: true }]} />
        </Form.Slot>
        <Button style={{ marginTop: 24 }} type="primary" size="large" htmlType="submit">提交</Button>
      </Form>
      <TextArea style={{ marginTop: 24, opacity: 0.6 }} readOnly value={JSON.stringify(value)} />
    </>
  );
};

export default NewAlbumForm;
