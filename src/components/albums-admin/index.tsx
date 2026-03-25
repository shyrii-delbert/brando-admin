import React, { useCallback, useState } from 'react';

import { IconPlus } from '@douyinfe/semi-icons';
import { Button, Row, Typography } from '@douyinfe/semi-ui';

import Albums from '$components/albums';
import NewAlbumSheet from '$components/new-album-sheet';

const AlbumsAdmin = () => {
  const [newAlbumSheetVisible, setNewAlbumSheetVisible] =
    useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const onNewAlbumSheetChange = useCallback(() => {
    setNewAlbumSheetVisible((v) => !v);
  }, []);

  const handleAlbumsChange = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  return (
    <>
      <Row type="flex" justify="space-between">
        <Typography.Title heading={5}>相簿</Typography.Title>
        <Button icon={<IconPlus />} onClick={onNewAlbumSheetChange}>
          创建
        </Button>
      </Row>
      <Albums refreshKey={refreshKey} onChanged={handleAlbumsChange} />
      <NewAlbumSheet
        visible={newAlbumSheetVisible}
        onCancel={onNewAlbumSheetChange}
        onSuccess={handleAlbumsChange}
      />
    </>
  );
};

export default AlbumsAdmin;
