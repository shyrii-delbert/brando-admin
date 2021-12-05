import React, { useState } from 'react';

import { Row, Typography } from '@douyinfe/semi-ui';

const { Text } = Typography;

const Albums = () => {
  const [albums, setAlbums] = useState<any[]>([]);

  if (albums.length === 0) {
    return <Row type="flex" justify="center">
      <Text type="tertiary">Empty</Text>
    </Row>
  }

  return <></>;
};

export default Albums;
