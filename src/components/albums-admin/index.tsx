import React, { useCallback, useState } from 'react';

import { IconPlus } from '@douyinfe/semi-icons';
import { Button, Row, Typography } from '@douyinfe/semi-ui';

import * as Styled from './styled';
import Albums from '$components/albums';
import NewAlbumSheet from '$components/new-album-sheet';

const AlbumsAdmin = () => {
  const [newAlbumSheetVisible, setNewAlbumSheetVisible] = useState<boolean>(false);

  const onNewAlbumSheetChange = useCallback(() => {
    setNewAlbumSheetVisible((v) => !v);
  }, []);

  return (
    <>
      <Row type="flex" justify="space-between">
        <Typography.Title heading={5} >相簿</Typography.Title>
        <Button icon={<IconPlus />} onClick={onNewAlbumSheetChange}>创建</Button>
      </Row>
      <Styled.Card
        style={{ width: '100%' }}
      >
        <Albums />
      </Styled.Card>
      <NewAlbumSheet visible={newAlbumSheetVisible} onCancel={onNewAlbumSheetChange} />
    </>
  );
};

export default AlbumsAdmin;
