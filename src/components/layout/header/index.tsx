import React from 'react';

import { Layout, Nav, Avatar } from '@douyinfe/semi-ui';
import { IconHome, IconTerminal } from '@douyinfe/semi-icons';
import { useUserInfo } from '$hooks/use-user-info';

const Header = () => {
  const user = useUserInfo();
  
  return <Layout.Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
    <div>
      <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
        <Nav.Header>
          <IconTerminal style={{ fontSize: 36, color: 'var(--semi-color-text-0)' }} />
        </Nav.Header>
        <Nav.Item itemKey="Home" text="Brando" icon={<IconHome size="large" />} />
        <Nav.Footer>
          <Avatar color="orange" size="small" src={user?.faceUrl}>
            {user ? user.nickname : ''}
          </Avatar>
        </Nav.Footer>
      </Nav>
    </div>
  </Layout.Header>;
}

export default Header;
