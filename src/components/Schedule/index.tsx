import { useGetClipsQuery } from '@store/apis/twitch/getClips';
import { useSelector } from '@store';

export const Schedule = () => {
  const { broadcasterId } = useSelector(({ info }) => info);
  const {
    data: clipsData,
    // error: clipsError,
    isLoading: isClipsLoading,
  } = useGetClipsQuery({ broadcasterId, isFeatured: true });
  const isRenderable = !!clipsData;
  let embedUrl = '';

  if (clipsData)
    embedUrl = `${clipsData.data[Math.round(Math.random() * (clipsData.data.length - 1))].embed_url}&parent=localhost&autoplay=true&muted=false&preload=metadata`;

  // Render nothing if data is loading or required data is incomplete
  if (isClipsLoading || !isRenderable) return false;

  // Render component
  return <iframe src={embedUrl} height="100%" width="100%" allowFullScreen />;
};
