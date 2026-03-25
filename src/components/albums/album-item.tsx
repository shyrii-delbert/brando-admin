import { AlbumRes } from '$typings/albums';
import React, { useCallback, useMemo, useState } from 'react';
import * as Styled from './styled';
import { Button, Popconfirm, Popover, Toast, Typography } from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import { matchImageUrl } from '$utils/image';
import ReactJson from 'react-json-view';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import EditAlbumSheet from './edit-album-sheet';
import { Api } from '$utils/request';

export const AlbumItem: React.FC<{ album: AlbumRes; onChanged?: () => void }> = (props) => {
  const { album, onChanged } = props;
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const date = useMemo(() => {
    return dayjs(album.date).format('YYYY/MM/DD');
  }, [album.date]);

  const handleEditVisibleChange = useCallback(() => {
    setEditVisible((visible) => !visible);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      const res = await Api.albums.delete(album.id!);
      if (![0, 200].includes(res.data.code)) {
        throw new Error(JSON.stringify(res.data));
      }
      Toast.success('删除成功');
      onChanged?.();
    } catch (error) {
      Toast.error('删除失败：' + JSON.stringify(error));
    }
  }, [album.id, onChanged]);

  return (
    <>
      <Styled.Card
        title={
          <div>
            <div className="font-bold text-lg text-white">{album.mainArea}</div>
            <div className="mt-2 text-gray-100">{album.subArea}</div>
          </div>
        }
        headerExtraContent={
          <div className="flex items-center gap-2">
            <Typography.Text>{date}</Typography.Text>
            <Button icon={<IconEdit />} onClick={handleEditVisibleChange}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除这个相簿？"
              content="删除后无法恢复。"
              onConfirm={handleDelete}
            >
              <Button type="danger" icon={<IconDelete />}>
                删除
              </Button>
            </Popconfirm>
          </div>
        }
      >
        <div className="flex gap-1 flex-wrap">
          {album.photos.map((photo) => (
            <Popover
              position="bottom"
              key={photo.id}
              title={photo.title}
              contentClassName="p-4 max-w-80"
              content={
                <div>
                  <div className="mb-1">
                    <Typography.Text>{photo.title}</Typography.Text>
                  </div>
                  <div className="mb-3">
                    <Typography.Text type="secondary">
                      {photo.description}
                    </Typography.Text>
                  </div>
                  <div className="mb-1">
                    <Typography.Text type="secondary">EXIF</Typography.Text>
                  </div>
                  <ReactJson
                    theme="tomorrow"
                    style={{ fontFamily: 'inherit' }}
                    enableClipboard={false}
                    iconStyle="square"
                    displayDataTypes={false}
                    displayObjectSize={false}
                    src={photo.image.exif}
                  />
                </div>
              }
            >
              <img
                src={matchImageUrl(photo.image, 'higher', '480p')}
                className="rounded inline-block size-60 object-cover"
              />
            </Popover>
          ))}
        </div>
      </Styled.Card>
      <EditAlbumSheet
        album={album}
        visible={editVisible}
        onCancel={handleEditVisibleChange}
        onSuccess={onChanged}
      />
    </>
  );
};
