import { AlbumRes } from '$typings/albums';
import React, { useMemo } from 'react';
import * as Styled from './styled';
import { Popover, Typography } from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import { matchImageUrl } from '$utils/image';
import ReactJson from 'react-json-view';

export const AlbumItem: React.FC<{ album: AlbumRes }> = (props) => {
  const { album } = props;

  const date = useMemo(() => {
    return dayjs(album.date).format('YYYY/MM/DD');
  }, [album.date]);

  return (
    <Styled.Card
      title={
        <div>
          <div className="font-bold text-lg text-white">{album.mainArea}</div>
          <div className="mt-2 text-gray-100">{album.subArea}</div>
        </div>
      }
      headerExtraContent={date}
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
  );
};
