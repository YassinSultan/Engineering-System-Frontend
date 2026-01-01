// SearchInput.jsx
import React, { useState } from "react";
import {
  AsyncPaginate,
  reduceGroupedOptions,
} from "react-select-async-paginate";
import { getSuggestions } from "../../../api/suggestionsAPI";
import { FaSearch } from "react-icons/fa";

export default function SearchInput({
  type = "global",
  model = "projects",
  column, // used only when type === "column"
  onSelect,
  placeholder = "بحث...",
  value,
}) {
  const [inputValue, setInputValue] = useState("");
  const loadOptions = async (search, prevOptions, { page }) => {
    if (!search?.trim()) {
      return {
        options: [],
        hasMore: false,
        additional: { page: 1 },
      };
    }

    try {
      const response = await getSuggestions({
        model,
        type,
        column: type === "global" ? undefined : column,
        search,
        page,
        limit: type === "global" ? 10 : 8,
      });
      return {
        options: response.options || [],
        hasMore: !!response.hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (err) {
      console.error("Suggestion load error:", err);
      return {
        options: [],
        hasMore: false,
        additional: { page },
      };
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: "48px",
      borderRadius: "8px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
      padding: "0 30px 0px 0px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      marginTop: 4,
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    }),
  };

  return (
    <div className="relative w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="p-2 absolute z-1 top-1/2 -translate-y-1/2 border-e border-gray-300">
        <FaSearch size={15} className="text-primary-500" />
      </div>
      <AsyncPaginate
        reduceOptions={reduceGroupedOptions}
        cacheOptions
        loadOptions={loadOptions}
        additional={{ page: 1 }}
        placeholder={placeholder}
        debounceTimeout={350}
        value={
          value ||
          (inputValue ? { label: inputValue, value: inputValue } : null)
        }
        onChange={onSelect}
        onInputChange={(val) => setInputValue(val)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            onSelect({ label: inputValue, value: inputValue });
          }
        }}
        closeMenuOnSelect
        isClearable
        isSearchable
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        styles={customStyles}
        noOptionsMessage={() => "لا توجد نتائج مطابقة"}
        loadingMessage={() => "جاري البحث..."}
        errorMessage={() => "حدث خطأ أثناء جلب الاقتراحات"}
      />
    </div>
  );
}
