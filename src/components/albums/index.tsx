import React, { useEffect, useState } from 'react';

import { Row, Typography } from '@douyinfe/semi-ui';
import { AlbumRes } from '$typings/albums';
import { Api } from '$utils/request';
import { AlbumItem } from './album-item';

const { Text } = Typography;

const Albums = () => {
  const [albums, setAlbums] = useState<AlbumRes[]>([]);

  useEffect(() => {
    (async () => {
      const res = await Api.albums.get();
      setAlbums(res.data.data.albums);
    })();
  }, []);

  if (albums.length === 0) {
    return (
      <Row type="flex" justify="center">
        <Text type="tertiary">Empty</Text>
      </Row>
    );
  }

  return (
    <>
      {albums.map((album) => (
        <AlbumItem album={album} key={album.id} />
      ))}
    </>
  );
};

export default Albums;
