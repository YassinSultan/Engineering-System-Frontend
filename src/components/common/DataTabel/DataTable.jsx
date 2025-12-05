import React from "react";
import {
  flexRender,
  getCoreRowModel,
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
import { FaArrowsUpDown } from "react-icons/fa6";

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
}) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination: { pageIndex, pageSize },
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  });

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

  return (
    <div className="table-container bg-card">
      <div className="w-full overflow-auto rounded-lg">
        <table className="w-full min-w-max text-sm text-nowrap">
          <thead className="bg-table-header text-table-header-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort =
                    header.column.columnDef.enableSorting !== false;
                  return (
                    <th
                      key={`${header.column.id}-${header.depth}`}
                      className={cn(
                        "px-4 py-3.5 font-semibold text-center whitespace-nowrap transition-colors bg-primary-500 text-primary-content-500",
                        canSort && "cursor-pointer hover:bg-primary-500/80"
                      )}
                      onClick={() => canSort && handleSort(header.column.id)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && getSortIcon(header.column.id)}
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
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
              className="px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} / صفحة
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(0)}
                disabled={pageIndex === 0}
                className="p-1.5 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                title="الصفحة الأولى"
              >
                <BiChevronsRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="p-1.5 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
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
                className="p-1.5 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                title="الصفحة التالية"
              >
                <BiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
                className="p-1.5 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
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
