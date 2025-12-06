import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  icon = null,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all cursor-pointer";

  const variants = {
    primary:
      "bg-primary-500 text-primary-content-500 hover:bg-primary-600 hover:text-primary-content-600 focus:ring-primary-500",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    light: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
    dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabledStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {children}
    </button>
  );
}
