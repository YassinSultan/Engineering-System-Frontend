import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { getBillOfQuantities } from "../../../api/billOfQuantitieAPI";
import toast from "react-hot-toast";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Can from "../../common/Can/Can";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Button from "../../ui/Button/Button";
import DataTable from "../../common/DataTabel/DataTable";
import { FaPlus } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

export default function BillOfQuantitie() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalSearchValue, setGlobalSearchValue] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();

  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "BillOfQuantitie",
      pageIndex,
      pageSize,
      globalSearchValue?.value,
      sorting,
      columnFilters,
    ],
    queryFn: () =>
      getBillOfQuantities({
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
      toast.success("تم جلب المقايسات بنجاح");
    },
    onError: (error) => {
      console.log(error);
      toast.error("حدث خطاء اثناء جلب المقايسات");
    },
  });
  //   table coulmn
  const columns = [
    {
      id: "name",
      header: "اسم المقايسة",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.name}
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "companyName",
      header: "اسم الشركة",
      accessorKey: "companyName",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.company.companyName}
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "projectName",
      header: "اسم المشروع",
      accessorKey: "projectName",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.project.name}
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "projectDuration",
      header: "مدة المشروع",
      accessorKey: "projectDuration",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.projectDuration} شهر
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "area",
      header: "مساحة المسطح",
      accessorKey: "area",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.area}
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "search",
        model: "projects",
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      enableSorting: false,
      enableFilter: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Can action="projects:read" unitId={row.original.organizationalUnit}>
            <NavLink to={`/projects/read/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <BsEye className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          <Can
            action="projects:update:project"
            unitId={row.original.organizationalUnit}
          >
            <NavLink to={`/projects/update/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors">
                <BiEdit className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
        </div>
      ),
    },
  ];
  // if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle
          title="ادارة المقايسات"
          subTitle="يمكنك التحكم في المقايسات من هنا"
        />
        <div className="flex gap-2">
          {/* <Can action="projects:read">
            <Button
              variant="secondary"
              icon={<FaDownload />}
              onClick={() => excelMutation.mutate()} // ← لازم .mutate()
              disabled={excelMutation.isPending} // ← loading state
            >
              {excelMutation.isPending ? "جاري التصدير..." : "تصدير إكسل"}
            </Button>
          </Can> */}
          <Can action="billOfQuantitie:create:billOfQuantitie">
            <Button
              onClick={() => navigate("/bill-of-quantitie/create")}
              icon={<FaPlus />}
            >
              اضافة مقايسة
            </Button>
          </Can>
        </div>
      </div>
      <div className="flex items-center justify-between py-2 px-4 bg-base my-4 rounded-xl gap-3">
        {/* search */}

        <SearchInput
          className="max-w-xl"
          type="global"
          model="projects"
          onSelect={(selectedOption) => {
            console.log(selectedOption);
            setGlobalSearchValue(selectedOption); // full object
            setPageIndex(0); // reset to page 1
          }}
          value={globalSearchValue || ""}
          placeholder="ابحث عن اسم المقايسة، المشروع، الشركة..."
        />

        {/* refresh button */}
        <Button
          disabled={isLoading}
          onClick={() => refetch()}
          className="h-fit"
        >
          <FiRefreshCcw className={`${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      {/* Table */}
      <div>
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
      </div>
    </>
  );
}
