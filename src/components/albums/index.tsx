import React, { useCallback, useEffect, useState } from 'react';

import { AlbumRes, GetAlbumsQuery } from '$typings/albums';
import { Api } from '$utils/request';
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Row,
  Spin,
  Typography,
} from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import { AlbumItem } from './album-item';

const { Text } = Typography;

const PAGE_SIZE = 10;

const formatQueryDate = (value?: Date) => {
  if (!value) {
    return undefined;
  }

  return dayjs(value).format('YYYY-MM-DD');
};

const Albums = ({
  refreshKey,
  onChanged,
}: {
  refreshKey?: number;
  onChanged?: () => void;
}) => {
  const [albums, setAlbums] = useState<AlbumRes[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [queryText, setQueryText] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState<
    Omit<GetAlbumsQuery, 'page' | 'page_size'>
  >({});

  useEffect(() => {
    let canceled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await Api.albums.get({
          ...filters,
          page,
          page_size: PAGE_SIZE,
        });

        if (canceled) {
          return;
        }

        const nextAlbums = res.data.data.albums;
        const nextTotal = res.data.data.total;

        if (page > 1 && nextAlbums.length === 0 && nextTotal > 0) {
          setPage((currentPage) => Math.max(1, currentPage - 1));
          return;
        }

        setAlbums(nextAlbums);
        setTotal(nextTotal);
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [filters, page, refreshKey]);

  const handleSearch = useCallback(() => {
    setPage(1);
    setFilters({
      query: queryText.trim() || undefined,
      start_date: formatQueryDate(startDate),
      end_date: formatQueryDate(endDate),
    });
  }, [endDate, queryText, startDate]);

  const handleReset = useCallback(() => {
    setQueryText('');
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
    setFilters({});
  }, []);

  return (
    <>
      <div className="mt-4 rounded-md border border-neutral-200 p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Input
            value={queryText}
            onChange={setQueryText}
            placeholder="按名称关键字搜索"
            style={{ width: 240 }}
          />
          <DatePicker
            type="date"
            value={startDate}
            onChange={(value) =>
              setStartDate(value ? new Date(value as any) : undefined)
            }
            placeholder="开始日期"
          />
          <DatePicker
            type="date"
            value={endDate}
            onChange={(value) =>
              setEndDate(value ? new Date(value as any) : undefined)
            }
            placeholder="结束日期"
          />
          <Button theme="solid" onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Text type="tertiary">共 {total} 条</Text>
        </div>
      </div>

      <Spin spinning={loading}>
        {albums.length === 0 ? (
          <Row type="flex" justify="center" className="py-10">
            <Text type="tertiary">Empty</Text>
          </Row>
        ) : (
          <>
            {albums.map((album) => (
              <AlbumItem album={album} key={album.id} onChanged={onChanged} />
            ))}
          </>
        )}
      </Spin>

      {total > 0 ? (
        <Row type="flex" justify="end" className="mt-4">
          <Pagination
            currentPage={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </Row>
      ) : null}
    </>
  );
};

export default Albums;
