import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from '../utils';
import { useEffect, useState, useRef } from 'react';

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo);
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleVideoSrcSet = () => {
    if(window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const loopLastThreeSeconds = () => {
    if (videoRef.current && videoDuration > 0) {
      const startTime = Math.max(0, videoDuration -5);

      setTimeout(() => {
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    return () => {
      window.removeEventListener('resize', handleVideoSrcSet);
    };
  }, []);

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 2 });
    gsap.to('#cta', { opacity: 1, y: -50, delay: 3 });
  }, []);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (currentVideo) {
      const handleTimeUpdate = () => {
        if (currentVideo.currentTime >= currentVideo.duration - 0.1) {
          loopLastThreeSeconds();
        }
      };

      currentVideo.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoDuration]);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">iPhone 15 Pro</p>
        <div className="md:w-10/12 w-9/12">
          <video 
            ref={videoRef}
            className="pointer-events-none" 
            autoPlay 
            muted 
            playsInline={true} 
            key={videoSrc}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">Buy</a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  );
};

export default Hero;