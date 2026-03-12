import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCamera,
  FiCalendar,
  FiStar,
  FiArrowRight,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import StudioCard from "../components/studio/StudioCard";
import HeroSection from "../components/home/HeroSection";
import { useStudios } from "../hooks/useStudio";
import Loading from "../components/common/Loading";

function Home() {
  // 인기 스튜디오 목록 (최신 3개)
  const { data: studiosData, isLoading } = useStudios({ size: 3 });
  const popularStudios = studiosData?.data?.content || [];

  const features = [
    {
      icon: FiSearch,
      title: "스마트 검색",
      description: "AI 기반 맞춤 추천으로 완벽한 스튜디오를 찾아보세요.",
      link: "/studios",
      linkText: "검색하기",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FiCamera,
      title: "실제 포트폴리오",
      description: "수천 개의 실제 촬영 결과물을 미리 확인하세요.",
      link: "/studios?tab=portfolio",
      linkText: "보러가기",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FiCalendar,
      title: "실시간 예약",
      description: "원하는 날짜와 시간에 바로 예약하세요.",
      link: "/studios?action=reserve",
      linkText: "예약하러 가기",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FiStar,
      title: "검증된 후기",
      description: "실제 이용자들의 솔직한 후기를 확인하세요.",
      link: "/studios?tab=reviews",
      linkText: "후기 확인",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  const stats = [
    { number: "500+", label: "전국 스튜디오" },
    { number: "10K+", label: "완료된 예약" },
    { number: "4.9", label: "평균 만족도" },
    { number: "24/7", label: "실시간 예약" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="bg-gradient-warm py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-cool">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section mb-4">
              StudioPick이 <span className="text-gradient">특별한 이유</span>
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              최신 기술과 사용자 중심 설계로 더 나은 예약 경험을 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={feature.link} className="group block h-full">
                  <div className="card card-hover h-full p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-primary-600 mb-4 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <span className="text-accent-600 font-medium flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                      {feature.linkText}
                      <FiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Studios Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
          >
            <div className="mb-4 lg:mb-0">
              <h2 className="heading-section mb-2">
                인기 <span className="text-gradient">스튜디오</span>
              </h2>
              <p className="text-primary-600">
                지금 가장 많은 고객이 찾는 스튜디오입니다
              </p>
            </div>
            <Link to="/studios" className="btn btn-primary group">
              더보기
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : popularStudios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularStudios.map((studio, index) => (
                <motion.div
                  key={studio.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StudioCard studio={studio} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCamera className="w-16 h-16 mx-auto text-primary-300 mb-4" />
              <p className="text-primary-600">
                아직 등록된 스튜디오가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent-500 to-accent-600 py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-hero text-white mb-6">
              지금 바로 특별한 순간을
              <br />
              예약하세요
            </h2>
            <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
              수백 개의 검증된 스튜디오에서
              <br />
              완벽한 촬영 경험을 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/studios" className="btn btn-secondary btn-large">
                <FiSearch className="mr-2" />
                스튜디오 찾기
              </Link>
              <Link
                to="/register"
                className="btn btn-ghost btn-large text-white border-white hover:bg-white hover:text-accent-600"
              >
                회원가입
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
