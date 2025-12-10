import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label = "بيانات",
      type = "text",
      id,
      error,
      options = [],
      rules = {},
      ...props
    },
    ref
  ) => {
    const inputId = id || "floating_" + label;
    const isRequired = !!rules.required;
    if (type === "select") {
      return (
        <>
          <div className="mb-2">
            <div className="relative">
              <select
                ref={ref}
                id={inputId}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-lg border 
            appearance-none focus:outline-none focus:ring-0 peer
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "focus:border-primary-500"
            }
          `}
                {...props}
                defaultValue={options[0].value}
              >
                {options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-background"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <label
                htmlFor={inputId}
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-background px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-2
                ${
                  error
                    ? "text-red-500"
                    : "text-body peer-focus:text-primary-500"
                }`}
              >
                {label}
                {isRequired && <span className="text-red-500">*</span>}
              </label>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="mb-2">
          <div className="relative">
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
              {isRequired && <span className="text-red-500">*</span>}
            </label>
          </div>
          {/* Error message inside component */}
          {error && (
            <p className="text-red-500 text-xs mt-2">{error.message}</p>
          )}
        </div>
      </>
    );
  }
);

export default Input;
