import React from 'react';

import { SideSheet } from '@douyinfe/semi-ui';
import NewAlbumForm from './components/new-album-form';

interface NewAlbumSheetProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const NewAlbumSheet = (props: NewAlbumSheetProps) => {
  const { visible, onCancel, onSuccess } = props;
  return (
    <SideSheet
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      placement="right"
      size="medium"
      title="新建相簿"
      style={{ overflow: 'hidden' }}
      bodyStyle={{ overflowY: 'auto' }}
    >
      <NewAlbumForm onExit={onCancel} onSuccess={onSuccess} />
    </SideSheet>
  );
};

export default NewAlbumSheet;
