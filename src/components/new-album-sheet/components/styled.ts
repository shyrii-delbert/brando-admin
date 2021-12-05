import styled from 'styled-components';

interface PreviewImageProps {
  src: string | null;
}

export const PreviewImage = styled.div<PreviewImageProps>`
  height: 140px;
  width: 140px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  background-image: url(${props => props.src});
  border-radius: var(--semi-border-radius-medium);
  cursor: grab;
`;

export const DragContainer = styled.div`
  left: 44px !important;
`;
