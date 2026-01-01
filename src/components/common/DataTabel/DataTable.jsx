// DataTable.jsx
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "../../../lib/utils";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";
import { FaArrowsUpDown, FaFilter, FaX } from "react-icons/fa6";
import AppSelect from "../../ui/AppSelect/AppSelect";
import ColumnFilter from "../ColumnFilter/ColumnFilter";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  pageCount = 1,
  totalRecords = 0,
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  columnFilters,
  onColumnFiltersChange,
}) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      pagination: { pageIndex, pageSize },
      sorting,
      columnVisibility,
      columnFilters,
    },
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange,
  });

  const [activeFilterColumnId, setActiveFilterColumnId] = useState(null);

  // One floating per filter button (we use the same instance but update reference)
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-center",
    middleware: [offset(10), flip(), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
  });

  const toggleFilter = (columnId) => (e) => {
    e.stopPropagation();
    e.preventDefault();

    setActiveFilterColumnId((prev) => (prev === columnId ? null : columnId));
  };

  const handleSort = (columnId) => {
    const currentSort = sorting.find((s) => s.id === columnId);
    let newSorting;

    if (!currentSort) {
      newSorting = [{ id: columnId, desc: false }];
    } else if (!currentSort.desc) {
      newSorting = [{ id: columnId, desc: true }];
    } else {
      newSorting = [];
    }

    onSortingChange(newSorting);
  };

  const getSortIcon = (columnId) => {
    const sort = sorting.find((s) => s.id === columnId);
    if (!sort) return <FaArrowsUpDown className="w-4 h-4 opacity-50" />;
    return sort.desc ? (
      <BsArrowDown className="w-4 h-4 text-primary-foreground" />
    ) : (
      <BsArrowUp className="w-4 h-4 text-primary-foreground" />
    );
  };

  const startRecord = totalRecords > 0 ? pageIndex * pageSize + 1 : 0;
  const endRecord = Math.min((pageIndex + 1) * pageSize, totalRecords);

  const getFilterDisplayValue = (column) => {
    const value = column.getFilterValue();
    if (!value) return null;

    const meta = column.columnDef.meta || {};
    const filterType = meta.filterType || "text";

    if (filterType === "dateRange") {
      return value.start && value.end
        ? `${value.start} → ${value.end}`
        : value.start || value.end || "";
    }

    if (filterType === "select" || filterType === "asyncSelect") {
      return value?.label || value?.value || String(value);
    }

    return String(value).trim();
  };
  const activeFilters = table
    .getState()
    .columnFilters.map((f) => {
      const column = table.getColumn(f.id);
      if (!column) return null;
      const displayValue = getFilterDisplayValue(column);
      return displayValue
        ? { id: f.id, label: column.columnDef.header, value: displayValue }
        : null;
    })
    .filter(Boolean);
  const handleClearAllFilters = () => {
    table.setColumnFilters([]);
  };
  const handleClearSingleFilter = (columnId) => {
    table.setColumnFilters((old) => old.filter((f) => f.id !== columnId));
  };
  return (
    <div className="table-container bg-card">
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="bg-muted/40 px-4 py-3 mb-4 bg-base roun-lg">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-sm font-semibold">
              عوامل التصفية الحالية ({activeFilters.length})
            </h6>
            <button
              onClick={handleClearAllFilters}
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-full hover:opacity-60 
                       flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>مسح الكل</span>
              <FaX size={10} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="bg-primary-500/10 border border-primary-500 text-primary text-xs px-3 py-1.5 
                         rounded-full flex items-center gap-2"
              >
                <span className="font-medium">{filter.label}:</span>
                <span className="text-primary/80">{filter.value}</span>
                <button
                  onClick={() => handleClearSingleFilter(filter.id)}
                  className="text-primary/70 hover:text-primary 
                           rounded-full p-0.5 hover:bg-primary/10 transition-colors"
                  title="إزالة هذا التصفية"
                >
                  <FaX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-full overflow-auto rounded-lg">
        <table className="w-full min-w-max text-sm text-nowrap">
          <thead className="bg-table-header text-table-header-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort =
                    header.column.columnDef.enableSorting !== false;
                  const canFilter =
                    header.column.columnDef.enableFilter !== false;

                  const isFilterOpen =
                    activeFilterColumnId === header.column.id;

                  return (
                    <th
                      key={`${header.column.id}-${header.depth}`}
                      className={cn(
                        "px-4 py-3.5 font-semibold text-center whitespace-nowrap transition-colors",
                        "bg-primary-500 text-primary-content-500",
                        canSort && "cursor-pointer hover:bg-primary-600"
                      )}
                      onClick={() => canSort && handleSort(header.column.id)}
                    >
                      <div className="flex items-center justify-center gap-2 relative">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {canSort && getSortIcon(header.column.id)}

                        {canFilter && (
                          <button
                            ref={isFilterOpen ? refs.setReference : null}
                            onClick={toggleFilter(header.column.id)}
                            className={cn(
                              "p-1.5 rounded transition-colors relative",
                              header.column.getFilterValue()
                                ? "text-primary bg-primary/30 border border-primary/50"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                            )}
                            title="تصفية العمود"
                          >
                            <FaFilter className="w-3.5 h-3.5" />

                            {header.column.getIsFiltered() && (
                              <span
                                className="
                                  absolute -top-1 -right-1 
                                  flex h-4 w-4 
                                  items-center justify-center 
                                  rounded-full bg-red-500 
                                  text-[10px] font-bold text-white
                                  ring-2 ring-white dark:ring-gray-900
                                "
                              >
                                •
                              </span>
                            )}
                          </button>
                        )}

                        {isFilterOpen && (
                          <div
                            ref={refs.setFloating}
                            style={{
                              ...floatingStyles,
                              position: "fixed", // ← تأكيد إضافي (مهم جداً)
                              zIndex: 9999,
                            }}
                          >
                            <ColumnFilter
                              column={header.column}
                              onClose={() => setActiveFilterColumnId(null)}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-table-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">
                      جاري التحميل...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      لا توجد بيانات
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "hover:bg-primary-200 hover:text-primary-content-200 transition-colors",
                    index % 2 === 0
                      ? "bg-primary-50 text-primary-content-50"
                      : "bg-primary-50/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`${row.id}-${cell.id}`}
                      className="px-4 py-3 text-center border-x last:border-l-0 first:border-s-0 "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRecords > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-muted/30 border-t border-table-border">
          <div className="text-sm text-muted-foreground">
            عرض{" "}
            <span className="font-semibold text-foreground">{startRecord}</span>{" "}
            إلى{" "}
            <span className="font-semibold text-foreground">{endRecord}</span>{" "}
            من أصل{" "}
            <span className="font-semibold text-foreground">
              {totalRecords}
            </span>{" "}
            سجل
          </div>

          <div className="flex items-center gap-4">
            <div className="w-35">
              <AppSelect
                isSearchable={false}
                size="sm"
                label=""
                value={{
                  value: pageSize,
                  label: `${pageSize}/ صفحة`,
                }}
                options={[
                  { value: 1, label: "1" },
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                onChange={(option) => {
                  onPageSizeChange(Number(option.value));
                  onPageChange(0);
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(0)}
                disabled={pageIndex === 0}
                className="p-1.5 cursor-pointer rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-primary-content-500 transition-colors"
                title="الصفحة الأولى"
              >
                <BiChevronsRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="p-1.5 cursor-pointer rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-primary-content-500 transition-colors"
                title="الصفحة السابقة"
              >
                <BiChevronRight className="w-4 h-4" />
              </button>

              <span className="px-3 py-1.5 text-sm font-medium">
                {pageIndex + 1} / {pageCount}
              </span>

              <button
                onClick={() => onPageChange(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1}
                className="p-1.5 cursor-pointer rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-primary-content-500 transition-colors"
                title="الصفحة التالية"
              >
                <BiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
                className="p-1.5 cursor-pointer rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-primary-content-500 transition-colors"
                title="الصفحة الأخيرة"
              >
                <BiChevronsLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
