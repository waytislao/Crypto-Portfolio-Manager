import React, { useCallback, useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { debounce } from "lodash";

interface Props extends ImageProps {
  fallbackSrc: string;
}

const ImageWithFallback = (props: Props) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  const setImgSrcDebounce = useCallback(
    debounce((newSrc) => {
      setImgSrc(newSrc);
    }, 600),
    [],
  );

  useEffect(() => {
    setImgSrcDebounce(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
