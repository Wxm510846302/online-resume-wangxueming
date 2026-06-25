import React from "react";
import { Composition } from "remotion";
import { ResumeIntroVideo } from "./resume-intro-video.jsx";

export const RemotionRoot = () => {
  return (
    <Composition
      id="ResumeIntro"
      component={ResumeIntroVideo}
      durationInFrames={1080}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
