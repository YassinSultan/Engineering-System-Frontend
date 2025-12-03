import React, { forwardRef } from "react";

const Input = forwardRef(
  ({ label = "بيانات", type = "text", id, error, ...props }, ref) => {
    const inputId = id || "floating_" + label;

    return (
      <div className="relative mb-5">
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-lg border 
            appearance-none focus:outline-none focus:ring-0 peer
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "focus:border-primary-500"
            }
          `}
          placeholder=" "
          {...props}
        />

        <label
          htmlFor={inputId}
          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-background px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-2
            ${error ? "text-red-500" : "text-body peer-focus:text-primary-500"}
          `}
        >
          {label}
        </label>

        {/* Error message inside component */}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

export default Input;
