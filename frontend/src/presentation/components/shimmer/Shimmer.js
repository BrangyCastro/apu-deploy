import React from "react";
import { Image, Breathing } from "react-shimmer";
import { ErrorImg } from "src/presentation/components";

export const ShimmerCustom = ({ url, path, height, width }) => {
  return (
    <Image
      src={url}
      fadeIn={true}
      fallback={<Breathing duration={10000} height={height} width={width} />}
      errorFallback={(err) => (
        <ErrorImg alt="not-vendors-photo" height={height} />
      )}
      NativeImgProps={{ alt: `vendors-photo`, height: height, width: width }}
    />
  );
};
