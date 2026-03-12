import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiCamera,
  FiHeart,
  FiShare2,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { formatPrice } from "../../utils/formatters";

const StickyBookingWidget = ({ studio, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const widgetTop = 800; // Start sticking after 800px
      setIsSticky(scrollY > widgetTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shootingTypes = [
    { value: "BODY_PROFILE", label: "바디프로필", price: studio.minPrice },
    { value: "PORTRAIT", label: "증명사진", price: studio.minPrice * 0.8 },
    { value: "FAMILY", label: "가족사진", price: studio.minPrice * 1.5 },
    { value: "COUPLE", label: "커플사진", price: studio.minPrice * 1.2 },
  ];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const calculatePrice = () => {
    const type = shootingTypes.find((t) => t.value === selectedType);
    return type ? type.price : studio.minPrice;
  };

  return (
    <motion.div
      className={`${className} ${isSticky ? "fixed top-20 right-4 z-40 w-80" : ""}`}
      initial={false}
      animate={{
        y: isSticky ? 0 : 0,
        scale: isSticky ? 0.95 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-large overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-primary-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-primary-900 mb-1">
                {studio.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-primary-600">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 font-medium">
                    {studio.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span>·</span>
                <span>{studio.reviewCount || 0}개 후기</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                <FiHeart />
              </button>
              <button className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                <FiShare2 />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">
              {formatPrice(calculatePrice())}
            </div>
            <div className="text-sm text-primary-600">부터</div>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4 border-b border-primary-100">
                {/* Date Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                    <FiCalendar className="w-4 h-4" />
                    촬영 일자
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={today}
                    max={maxDateStr}
                    className="input"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                    <FiClock className="w-4 h-4" />
                    촬영 시간
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input"
                  >
                    <option value="">시간 선택</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shooting Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                    <FiCamera className="w-4 h-4" />
                    촬영 종류
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {shootingTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedType === type.value
                            ? "bg-accent-500 text-white"
                            : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="p-6 space-y-3">
          <Link
            to={`/reservation/${studio.id}`}
            state={{
              date: selectedDate,
              time: selectedTime,
              type: selectedType,
            }}
            className="btn btn-primary w-full btn-large"
          >
            예약하기
          </Link>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            {isExpanded ? (
              <>
                간단히 보기
                <FiChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                상세 예약
                <FiChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Contact Info */}
        <div className="px-6 pb-6">
          <div className="text-center text-sm text-primary-600">
            <p>문의: {studio.phone || "02-1234-5678"}</p>
            <p className="mt-1">운영시간: 09:00 - 21:00</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StickyBookingWidget;
