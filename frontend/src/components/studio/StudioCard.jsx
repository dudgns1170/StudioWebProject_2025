import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiCamera, FiHeart } from "react-icons/fi";
import { formatPrice } from "../../utils/formatters";
import { SHOOTING_TYPES } from "../../constants/shootingTypes";
import AnimatedCard from "../common/AnimatedCard";

const StudioCard = ({ studio, selectedStudio }) => {
  const shootingTypeLabels =
    studio.shootingTypes
      ?.map((type) => SHOOTING_TYPES.find((t) => t.value === type)?.label)
      .filter(Boolean) || [];

  const isSelected = selectedStudio?.id === studio.id;

  return (
    <AnimatedCard animation="fadeUp" className="group">
      <Link to={`/studios/${studio.id}`} id={`studio-${studio.id}`}>
        <div
          className={`card card-hover overflow-hidden ${
            isSelected ? "ring-2 ring-accent-500 ring-offset-2" : ""
          }`}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={studio.thumbnailUrl || "/placeholder-studio.jpg"}
              alt={studio.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle favorite toggle
              }}
              className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:text-accent-500 transition-all opacity-0 group-hover:opacity-100"
            >
              <FiHeart className="w-5 h-5" />
            </button>

            {/* Rating Badge */}
            {studio.rating && (
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                <div className="flex items-center gap-1 text-white text-sm">
                  <FiStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{studio.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-semibold text-lg text-primary-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-1">
              {studio.name}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-primary-600 text-sm mb-3">
              <FiMapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{studio.address}</span>
            </div>

            {/* Shooting Types */}
            {shootingTypeLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {shootingTypeLabels.slice(0, 3).map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-lg"
                  >
                    {label}
                  </span>
                ))}
                {shootingTypeLabels.length > 3 && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-lg">
                    +{shootingTypeLabels.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Price and Reviews */}
            <div className="flex items-center justify-between pt-3 border-t border-primary-100">
              <div>
                <span className="text-lg font-bold text-accent-600">
                  {formatPrice(studio.minPrice)}
                </span>
                <span className="text-sm text-primary-600 ml-1">부터</span>
              </div>

              {studio.reviewCount > 0 && (
                <div className="flex items-center gap-1 text-sm text-primary-600">
                  <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{studio.reviewCount}개 후기</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </AnimatedCard>
  );
};

export default StudioCard;
