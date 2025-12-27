"use client";
import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";

import loadingAnimation from "../../assets/animations/loading.json";

const FullScreenLoader= () => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2);
    }
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0, 0, 0, 0.07)] z-[9999]">
      <Lottie
        animationData={loadingAnimation}
        loop
        className="w-60 h-60"
        lottieRef={lottieRef}
      />
    </div>
  );
};

export default FullScreenLoader;
