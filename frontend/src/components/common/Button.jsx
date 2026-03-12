import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-ghost",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-medium hover:shadow-large focus:ring-red-500",
  ghost: "btn-ghost",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "btn-large",
};

const MotionButton = motion.button;

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
  ...props
}) {
  const baseClasses = `
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  if (disabled || loading) {
    return (
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={baseClasses}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }

  return (
    <MotionButton
      type={type}
      onClick={onClick}
      className={baseClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </MotionButton>
  );
}

export default Button;
