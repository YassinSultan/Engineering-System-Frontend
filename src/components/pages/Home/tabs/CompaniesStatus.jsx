import React, { useState } from "react";
import SearchInput from "../../../ui/SearchInput/SearchInput";
import DataTable from "../../../common/DataTabel/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../../../../api/companyAPI";
import toast from "react-hot-toast";
import formatDate from "../../../../utils/formatDate";
import { NavLink } from "react-router";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import Can from "../../../common/Can/Can";
export default function CompaniesStatus() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalSearchValue, setGlobalSearchValue] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const { data: res, isLoading } = useQuery({
    queryKey: [
      "companies",
      pageIndex,
      pageSize,
      globalSearchValue?.value,
      sorting,
      columnFilters,
    ],
    queryFn: () =>
      getCompanies({
        page: pageIndex + 1,
        limit: pageSize,
        search: globalSearchValue?.value || undefined,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
        filters: JSON.stringify(
          columnFilters.reduce((acc, f) => {
            if (f.value) acc[f.id] = f.value;
            return acc;
          }, {}),
        ),
      }),
    onSuccess: () => {
      console.log(res);
      toast.success("تم جلب المستخدمين بنجاح");
    },
    onError: (error) => {
      console.log(error);
      toast.error("حدث خطاء اثناء جلب المستخدمين");
    },
  });
  const columns = [
    {
      id: "companyName",
      enableSorting: false,
      enableFilter: false,
      header: "اسم الشركة",
      accessorKey: "companyName",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.companyName}
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "search",
        model: "company",
      },
    },
    {
      id: "status",
      header: "كود الموافقة الامنية",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`text-xs font-bold px-4 py-1 rounded-full ${
            row.original.status === "STUDY"
              ? "bg-green-400/20 border border-green-400"
              : row.original.status === "ONGOING"
                ? "bg-yellow-400/20 border border-yellow-400"
                : "bg-red-400/20 border border-red-400"
          }`}
        >
          {row.original.status === "STUDY"
            ? "دراسة"
            : row.original.status === "ONGOING"
              ? "جاري"
              : "منهي"}
        </span>
      ),
      meta: {
        filterType: "select",
        options: [
          {
            value: "STUDY",
            label: "دراسة",
          },
          {
            value: "ONGOING",
            label: "جاري",
          },
          {
            value: "FINISHED",
            label: "منهي",
          },
        ],
      },
    },
    {
      id: "contractingParty",
      header: "عدد المشروعات المسندة",
      accessorKey: "contractingParty",
      cell: ({ row }) => (
        <span
          className={`text-xs font-bold rounded-full  px-4 py-1 ${
            row.original.contractingParty === "MILITARY"
              ? "bg-red-400/20 border border-red-400"
              : row.original.contractingParty === "MILITARY"
                ? "bg-green-400/20 border border-green-400"
                : "bg-blue-400/20 border border-blue-400"
          }`}
        >
          {row.original.contractingParty === "CIVILIAN"
            ? "جهة مدنية"
            : row.original.contractingParty === "MILITARY"
              ? "جهة عسكرية"
              : "جهة موازنة"}
        </span>
      ),
      meta: {
        filterType: "select",
        options: [
          {
            value: "CIVILIAN",
            label: "جهة مدنية",
          },
          {
            value: "MILITARY",
            label: "جهة عسكرية",
          },
          {
            value: "BUDGET",
            label: "جهة موازنة",
          },
        ],
      },
    },
    {
      id: "code",
      header: "جملة الاعمال المسندة",
      accessorKey: "code",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.code}</span>
      ),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "startDate",
      header: "عدد العقود",
      accessorKey: "startDate",
      meta: {
        filterType: "date",
      },
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">
          {formatDate(row.original.startDate)}
        </span>
      ),
    },
    {
      id: "location",
      header: "قيمة العقود",
      accessorKey: "location",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.location}</span>
      ),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "عدد المقايسات",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "قيمة المقايسات",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "اجمالي المستحق",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "اجمالي المنصرف خامات",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "اجمالي المنصرف مستخلصات",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "اجمالي صافي المنصرف",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
    {
      id: "landArea",
      header: "اجمالي المتبقي",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
      meta: {
        filterType: "number",
        model: "projects",
      },
    },
  ];
  return (
    <>
      <section>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl text-primary-500">موقف الشركات</h2>
          <SearchInput
            className="max-w-sm"
            type="global"
            model="projects"
            onSelect={(selectedOption) => {
              setGlobalSearchValue(selectedOption); // full object
              setPageIndex(0); // reset to page 1
            }}
            value={globalSearchValue || ""}
            placeholder="ابحث ..."
          />
        </div>
        <DataTable
          data={res?.data || []}
          columns={columns}
          loading={isLoading}
          pageCount={res?.totalPages || 0}
          totalRecords={res?.total || 0}
          pageIndex={pageIndex}
          pageSize={pageSize}
          sorting={sorting}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
        />
      </section>
    </>
  );
}
