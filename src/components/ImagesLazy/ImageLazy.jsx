import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ImageDefault from "../../static/images/image-default.png";

const ImageLazy = (props) => {
  return (
    <LazyLoadImage
      {...props}
      onError={(e) => {
        if (e.target.src !== ImageDefault) {
          e.target.onerror = null;
          e.target.src = ImageDefault;
        }
      }}
    />
  );
};

export { ImageLazy };
