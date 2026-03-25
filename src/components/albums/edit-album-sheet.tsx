import { AlbumRes } from '$typings/albums';
import { Api } from '$utils/request';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Input,
  Popconfirm,
  SideSheet,
  Spin,
  TextArea,
  Toast,
  Typography,
  Upload,
} from '@douyinfe/semi-ui';
import { IconDelete, IconPlus, IconUpload } from '@douyinfe/semi-icons';
import { AxiosProgressEvent } from 'axios';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

interface EditAlbumSheetProps {
  album: AlbumRes;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

interface EditablePhoto {
  key: string;
  imageId?: string;
  file?: File;
  previewUrl: string;
  title: string;
  description: string;
  isPost: boolean;
  progress?: number;
}

const buildInitialPhotos = (album: AlbumRes): EditablePhoto[] => {
  return album.photos.map((photo) => ({
    key: photo.id || photo.image.id,
    imageId: photo.image.id,
    previewUrl:
      photo.image.proxied['480p'] ||
      photo.image.proxied['720p'] ||
      photo.image.proxied['1080p'] ||
      photo.image.objectPath,
    title: photo.title,
    description: photo.description,
    isPost: photo.isPost,
    progress: 100,
  }));
};

const revokeObjectUrls = (photos: EditablePhoto[]) => {
  photos.forEach((photo) => {
    if (photo.file) {
      URL.revokeObjectURL(photo.previewUrl);
    }
  });
};

const EditAlbumSheet = (props: EditAlbumSheetProps) => {
  const { album, visible, onCancel, onSuccess } = props;
  const [mainArea, setMainArea] = useState<string>(album.mainArea);
  const [subArea, setSubArea] = useState<string>(album.subArea);
  const [date, setDate] = useState<Date>(new Date(album.date));
  const [photos, setPhotos] = useState<EditablePhoto[]>(() => buildInitialPhotos(album));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const photosRef = useRef<EditablePhoto[]>(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    revokeObjectUrls(photosRef.current);
    setMainArea(album.mainArea);
    setSubArea(album.subArea);
    setDate(new Date(album.date));
    setPhotos(buildInitialPhotos(album));
  }, [album, visible]);

  useEffect(() => {
    return () => {
      revokeObjectUrls(photosRef.current);
    };
  }, []);

  const displayDate = useMemo(() => dayjs(album.date).format('YYYY/MM/DD'), [album.date]);

  const updatePhoto = useCallback((key: string, value: Partial<EditablePhoto>) => {
    setPhotos((current) =>
      current.map((photo) => (photo.key === key ? { ...photo, ...value } : photo)),
    );
  }, []);

  const handlePosterChange = useCallback((key: string, checked: boolean) => {
    setPhotos((current) =>
      current.map((photo) => ({
        ...photo,
        isPost: photo.key === key ? checked : false,
      })),
    );
  }, []);

  const handleRemovePhoto = useCallback((key: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.key === key);
      if (target?.file) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((photo) => photo.key !== key);
    });
  }, []);

  const handleFileChange = useCallback((files: File[]) => {
    setPhotos((current) => {
      const existingNames = new Set(current.filter((photo) => photo.file).map((photo) => photo.file!.name));
      const nextPhotos = files
        .filter((file) => !existingNames.has(file.name))
        .map((file) => ({
          key: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          previewUrl: URL.createObjectURL(file),
          title: '',
          description: '',
          isPost: false,
          progress: 0,
        }));

      return [...current, ...nextPhotos];
    });
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    setPhotos((current) => {
      const nextPhotos = [...current];
      const [removed] = nextPhotos.splice(result.source.index, 1);
      nextPhotos.splice(result.destination!.index, 0, removed);
      return nextPhotos;
    });
  }, []);

  const uploadPhoto = useCallback(async (photo: EditablePhoto) => {
    if (photo.imageId) {
      return photo.imageId;
    }

    if (!photo.file) {
      return null;
    }

    const form = new FormData();
    form.set('image', photo.file);

    try {
      const res = await Api.images.post(form, (progress: AxiosProgressEvent) => {
        updatePhoto(photo.key, {
          progress: Math.max(0, Math.round((progress.progress || 0) * 100)),
        });
      });

      updatePhoto(photo.key, {
        imageId: res.data.data.imageId,
        progress: 100,
      });

      return res.data.data.imageId;
    } catch (error) {
      updatePhoto(photo.key, { progress: 0 });
      Toast.error('图片上传失败：' + photo.file.name);
      return null;
    }
  }, [updatePhoto]);

  const handleSubmit = useCallback(async () => {
    const trimmedMainArea = mainArea.trim();
    const trimmedSubArea = subArea.trim();
    const coverCount = photos.filter((photo) => photo.isPost).length;

    if (!trimmedMainArea || !trimmedSubArea) {
      Toast.error('请填写完整的相册信息');
      return;
    }

    if (!date || Number.isNaN(date.getTime())) {
      Toast.error('请选择有效日期');
      return;
    }

    if (photos.length === 0) {
      Toast.error('至少保留一张照片');
      return;
    }

    if (coverCount !== 1) {
      Toast.error('请确保恰好设置一张封面');
      return;
    }

    if (photos.some((photo) => !photo.title.trim())) {
      Toast.error('请完善每张照片的标题');
      return;
    }

    setSubmitting(true);
    const loadingToast = Toast.info({
      content: '更新中',
      icon: <Spin />,
      duration: 0,
    });

    try {
      const uploadedImageIds: string[] = [];

      for (const photo of photos) {
        const imageId = await uploadPhoto(photo);
        if (!imageId) {
          throw new Error('upload_failed');
        }
        uploadedImageIds.push(imageId);
      }

      const res = await Api.albums.put(album.id!, {
        mainArea: trimmedMainArea,
        subArea: trimmedSubArea,
        date: date.toISOString(),
        photos: photos.map((photo, index) => ({
          imageId: uploadedImageIds[index],
          title: photo.title.trim(),
          description: photo.description.trim(),
          isPost: photo.isPost,
        })),
      });

      if (![0, 200].includes(res.data.code)) {
        throw new Error(JSON.stringify(res.data));
      }

      Toast.success('更新成功');
      onSuccess?.();
      onCancel();
    } catch (error) {
      Toast.error('更新失败：' + JSON.stringify(error));
    } finally {
      Toast.close(loadingToast);
      setSubmitting(false);
    }
  }, [album.id, date, mainArea, onCancel, onSuccess, photos, subArea, uploadPhoto]);

  return (
    <SideSheet
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      placement="right"
      size="medium"
      title={`编辑相簿 · ${displayDate}`}
      style={{ overflow: 'hidden' }}
      bodyStyle={{ overflowY: 'auto' }}
      footer={
        <div className="flex justify-end">
          <Button type="primary" loading={submitting} onClick={handleSubmit}>
            保存修改
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex flex-col gap-3">
            <DatePicker
              type="date"
              value={date}
              onChange={(value) => setDate(value as Date)}
              placeholder="日期"
            />
            <Input value={mainArea} onChange={setMainArea} placeholder="如：深圳" />
            <Input value={subArea} onChange={setSubArea} placeholder="如：深圳湾公园" />
          </div>
        </Card>

        <Card
          title="补充照片"
          headerExtraContent={<IconPlus />}
        >
          <Upload
            action=""
            uploadTrigger="custom"
            onFileChange={(files) => handleFileChange(files)}
            draggable
            dragMainText="点击上传文件或拖拽文件到这里"
            dragSubText="支持 .png, .jpeg, .jpg, .bmp, .webp 类型"
            accept=".png,.jpeg,.jpg,.bmp,.webp"
            fileList={[]}
            multiple
          />
        </Card>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="edit-album-photos">
            {(dropProvided) => (
              <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                {photos.map((photo, index) => (
                  <Draggable key={photo.key} draggableId={photo.key} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          marginTop: 16,
                          ...dragProvided.draggableProps.style,
                        }}
                      >
                        <Card
                          bodyStyle={{ paddingTop: 16 }}
                          headerExtraContent={
                            <Popconfirm
                              title="确认移除这张照片？"
                              content="保存后会从相册里删除这张照片。"
                              onConfirm={() => handleRemovePhoto(photo.key)}
                            >
                              <Button theme="borderless" type="danger" icon={<IconDelete />} />
                            </Popconfirm>
                          }
                        >
                          <div className="flex gap-4">
                            <div className="w-36 shrink-0">
                              <img
                                src={photo.previewUrl}
                                className="h-36 w-36 rounded object-cover"
                              />
                              {photo.file && (
                                <div className="mt-2 text-xs text-[var(--semi-color-text-2)]">
                                  <div className="flex items-center gap-1">
                                    <IconUpload />
                                    <span>待上传新图</span>
                                  </div>
                                  {photo.progress !== undefined &&
                                    photo.progress > 0 &&
                                    photo.progress < 100 && (
                                      <div className="mt-1">{photo.progress}%</div>
                                    )}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col gap-3">
                              <Input
                                value={photo.title}
                                onChange={(value) => updatePhoto(photo.key, { title: value })}
                                placeholder="标题"
                              />
                              <TextArea
                                value={photo.description}
                                onChange={(value: string) =>
                                  updatePhoto(photo.key, { description: value })
                                }
                                placeholder="描述"
                                rows={4}
                              />
                              <Checkbox
                                checked={photo.isPost}
                                onChange={(event) =>
                                  handlePosterChange(photo.key, !!event.target.checked)
                                }
                              >
                                设为封面
                              </Checkbox>
                              {photo.imageId && (
                                <Typography.Text type="tertiary">
                                  图片 ID：{photo.imageId}
                                </Typography.Text>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </SideSheet>
  );
};

export default EditAlbumSheet;
