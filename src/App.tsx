import React from 'react';
import { Layout, Breadcrumb, Skeleton } from '@douyinfe/semi-ui';

import { useDarkMode } from '$hooks/use-dark-mode';
import Header from '$components/layout/header';

import * as Styled from './styled';
import AlbumsAdmin from '$components/albums-admin';

const { Content } = Layout;

const App = () => {
  useDarkMode();

  return (
    <Styled.Layout>
      <Header />
      <Content
        style={{
          padding: '24px',
          backgroundColor: 'var(--semi-color-bg-0)',
        }}
      >
        <AlbumsAdmin />
      </Content>
    </Styled.Layout>
  );
}

export default App;
