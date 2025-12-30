// ColumnFilter.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "../../ui/Button/Button";
import AppSelect from "../../ui/AppSelect/AppSelect";

export default function ColumnFilter({ column, onClose }) {
  const [value, setValue] = useState(column.getFilterValue() ?? "");
  const containerRef = useRef(null);

  const meta = column.columnDef.meta || {};
  const filterType = meta.filterType || "text";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleApply = () => {
    const cleanedValue = typeof value === "string" ? value.trim() : value;
    column.setFilterValue(cleanedValue || undefined);
    onClose();
  };

  const handleClear = () => {
    setValue("");
    column.setFilterValue(undefined);
    onClose();
  };

  const renderFilterInput = () => {
    switch (filterType) {
      case "asyncSelect":
        return (
          <AppSelect
            isCreatable={false}
            loadOptionsFn={meta.loadOptionsFn}
            createOptionsFn={meta.createOptionsFn}
            value={value}
            onChange={(opt) => setValue(opt)}
            isSearchable={true}
            placeholder="اكتب للبحث..."
          />
        );

      case "select":
        return (
          <AppSelect
            options={meta.options}
            label={""}
            onChange={(opt) => setValue(opt)}
            isClearable={false}
          />
        );

      case "dateRange":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1">من</label>
              <input
                type="date"
                value={value?.start || ""}
                onChange={(e) => setValue({ ...value, start: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">إلى</label>
              <input
                type="date"
                value={value?.end || ""}
                onChange={(e) => setValue({ ...value, end: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        );

      default:
        return (
          <input
            type={filterType === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="اكتب قيمة البحث..."
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        w-80 min-w-[18rem] max-w-[24rem]
        bg-primary-50 dark:bg-primary-800
        border border-primary-500 dark:border-primary-600
        rounded-lg shadow-xl p-4
        text-primary-content-50 dark:text-primary-content-800
        z-50
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">تصفية حسب: {column.columnDef.header}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
          aria-label="إغلاق"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5 text-start">
        <div>{renderFilterInput()}</div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleClear}>
            مسح
          </Button>
          <Button size="sm" onClick={handleApply}>
            تطبيق
          </Button>
        </div>
      </div>
    </div>
  );
}
