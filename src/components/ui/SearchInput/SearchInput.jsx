import React, { useState } from "react";

export default function SearchInput({
  fields = [],
  suggestions = [],
  selectedField, // <-- field اللي تم اختياره
  onSearchFieldChange,
  onChangeText,
  onSelectSuggestion,
}) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const text = e.target.value;
    setValue(text);

    // لو الحقل = all → مفيش suggestions
    if (selectedField === "all") {
      return;
    }

    onChangeText(text); // شغّل suggestion API
    setShowSuggestions(true);
  };

  const handleSelect = (item) => {
    setValue(item);
    onSelectSuggestion(item); // Search
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSelectSuggestion(value);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full my-4">
      <div className="flex">
        {/* اختيار نوع البحث */}
        <select
          name="search-selector"
          className="px-3 py-2 rounded-s-lg bg-primary-500 text-primary-content-500 w-fit"
          defaultValue="all"
          onChange={(e) => onSearchFieldChange(e.target.value)}
        >
          <option
            value="all"
            className="bg-primary-500 text-primary-content-500"
          >
            بحث شامل
          </option>

          {fields.map((f) => (
            <option
              key={f.value}
              value={f.value}
              className="bg-primary-500 text-primary-content-500 z-40"
            >
              {f.label}
            </option>
          ))}
        </select>

        {/* input */}
        <div className="relative w-full">
          <input
            type="text"
            className="w-full px-4 py-2 border border-primary-500 rounded-l-lg h-full focus:outline-none focus:border-primary-500"
            placeholder="ابحث..."
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (selectedField !== "all") setShowSuggestions(true);
            }}
          />

          {/* Suggestions */}
          {showSuggestions &&
            selectedField !== "all" &&
            suggestions?.data?.length > 0 && (
              <ul className="absolute left-0 right-0 border mt-1 rounded-md shadow-md max-h-40 overflow-auto z-10">
                {suggestions.data.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className="px-3 py-2 cursor-pointer hover:bg-primary-500 hover:text-primary-content-500"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
}
