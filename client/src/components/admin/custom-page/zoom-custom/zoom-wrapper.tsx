"use client";

import React, { useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { ZoomControls } from "./zoom-controls";

export const ZoomWrapper = ({ children }: { children: React.ReactNode }) => {
  const [zoomPercent, setZoomPercent] = useState(100);
  const onZoomStopHandler = (ref: ReactZoomPanPinchRef) => {
    const percent = Math.round(ref.state.scale * 100);
    setZoomPercent(percent);
  };

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.25}
      maxScale={4}
      wheel={{ disabled: false }}
      doubleClick={{ disabled: false }}
      pinch={{ disabled: false }}
      panning={{ disabled: false }}
      onZoomStop={onZoomStopHandler}
    >
      {(
        {
          //  zoomIn,
          //  zoomOut,
          //   resetTransform,
          //    ...rest
        }
      ) => (
        <>
          {/* <div style={{ marginBottom: 10 }}>
            <button onClick={() => zoomIn()}>Zoom In +</button>
            <button onClick={() => zoomOut()}>Zoom Out -</button>
            <button onClick={() => resetTransform()}>Reset</button>
          </div> */}
          <TransformComponent>{children}</TransformComponent>
          <ZoomControls percent={zoomPercent} setPercent={setZoomPercent} />
        </>
      )}
    </TransformWrapper>
  );
};
