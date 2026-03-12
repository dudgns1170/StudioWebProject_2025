import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiCamera,
  FiPlay,
  FiPause,
  FiStar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const slides = [
    {
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "당신의 특별한 순간을",
      subtitle: "전문가의 손길로 완벽하게 담아내다",
      cta: "스튜디오 찾기",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=1920&h=1080&fit=crop",
      title: "감성적인 공간에서",
      subtitle: "최상의 결과물을 만나보세요",
      cta: "포트폴리오 보기",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop",
      title: "편리한 예약 시스템",
      subtitle: "원하는 시간에 바로 예약하세요",
      cta: "예약하기",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {currentSlideData.type === "video" ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={currentSlideData.url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={currentSlideData.url}
              alt={currentSlideData.title}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-primary-900/20 to-primary-900/60" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <h1 className="heading-display mb-6">
                <span className="text-gradient">{currentSlideData.title}</span>
                <br />
                {currentSlideData.subtitle}
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-lg">
                바디프로필, 증명사진, 가족사진, 커플사진까지
                <br />
                다양한 스튜디오를 한 곳에서 비교하고 예약하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/studios">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-large w-full sm:w-auto"
                  >
                    <FiSearch className="mr-2" />
                    {currentSlideData.cta}
                  </motion.button>
                </Link>
                <Link to="/studios?featured=true">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary btn-large w-full sm:w-auto"
                  >
                    <FiStar className="mr-2" />
                    인기 스튜디오
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Floating Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="glass rounded-2xl p-6 shadow-large">
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  빠른 스튜디오 찾기
                </h3>

                <div className="space-y-4">
                  {/* Location Input */}
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                    <input
                      type="text"
                      placeholder="지역을 입력하세요 (예: 수원시)"
                      className="input pl-12"
                    />
                  </div>

                  {/* Date Input */}
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                    <input type="date" className="input pl-12" />
                  </div>

                  {/* Type Select */}
                  <div className="relative">
                    <FiCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                    <select className="input pl-12 appearance-none">
                      <option value="">촬영 종류 선택</option>
                      <option value="portrait">프로필 사진</option>
                      <option value="family">가족 사진</option>
                      <option value="couple">커플 사진</option>
                      <option value="wedding">웨딩 사진</option>
                    </select>
                  </div>

                  <Link to="/studios" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-primary w-full"
                    >
                      검색하기
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button for Video */}
      {currentSlideData.type === "video" && (
        <button
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
      )}

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
