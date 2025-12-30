import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { getProjects } from "../../../api/projectApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Can from "../../common/Can/Can";
import { FaKeycdn, FaPlus } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import DataTable from "../../common/DataTabel/DataTable";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import formatDate from "../../../utils/formatDate";
import AppSelect from "../../ui/AppSelect/AppSelect";
import { filterFns } from "@tanstack/react-table";

export default function Project() {
  const [tab, setTab] = useState("");
  const [status, setStatus] = useState({
    value: "",
    label: "الكل",
  });
  console.log(status);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState("all"); // default field
  const [searchString, setSearchString] = useState(""); //filter Search
  const [globalFilter, setGlobalFilter] = useState(""); //real filter after user click button or select suggestion
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();
  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "projects",
      pageIndex,
      pageSize,
      globalFilter,
      sorting,
      tab,
      status,
      columnFilters,
    ],
    queryFn: () =>
      getProjects({
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
        filters: JSON.stringify({
          contractingParty: tab,
          status: status.value,
          ...columnFilters.reduce((acc, filter) => {
            acc[filter.id] =
              typeof filter.value === "object" && filter.value !== null
                ? filter.value.value // في حالة Select
                : filter.value; // في حالة primitive
            return acc;
          }, {}),
        }),
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
  // const { data: suggestions } = useQuery({
  //   queryKey: ["suggestions", searchField, searchString],
  //   queryFn: () => suggestionFilter(searchField, { search: searchString }),
  //   enabled: searchString.length > 1, // مشتغلش إلا لما يكتب كفاية
  // });
  // // Delete Mutation
  // const deleteMutation = useMutation({
  //   mutationFn: deleteUser,
  //   onSuccess: () => {
  //     toast.success("تم حذف المستخدم بنجاح");
  //     refetch();
  //   },
  //   onError: (error) => {
  //     console.log(
  //       "فشل حذف المستخدم: " + (error.response?.data?.message || error.message)
  //     );
  //     toast.error("فشل حذف المستخدم");
  //   },
  // });
  // const excelMutation = useMutation({
  //   mutationKey: ["export-companies"],
  //   mutationFn: () =>
  //     exportUsers({
  //       search: globalFilter, // البحث الحالي
  //       filters: {}, // لو عندك فلاتر متقدمة، مررها هنا
  //       // مثال: filters: advancedFilters,
  //     }),
  //   onSuccess: () => {
  //     toast.success("تم تصدير الملف بنجاح!");
  //   },
  //   onError: (error) => {
  //     if (error.response?.status === 404) {
  //       toast.error("لا توجد بيانات للتصدير بناءً على الفلاتر الحالية");
  //     } else {
  //       toast.error("فشل في تصدير الملف");
  //     }
  //     console.error("Export error:", error);
  //   },
  // });
  // const handelDelete = (id) => {
  //   Swal.fire({
  //     title: "هل انت متاكد من حذف المستخدم؟",
  //     text: "لا يمكنك التراجع عن هذا الحذف",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "حذف",
  //     cancelButtonText: "الغاء",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteMutation.mutate(id);
  //     }
  //   });
  // };

  //   table coulmn
  const columns = [
    {
      id: "name",
      header: "اسم المشروع",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1 rounded-md">
          {row.original.name}
        </span>
      ),
      filterFn: (row, id, value) => row.getValue(id).includes(value),
      meta: {
        filterType: "text",
      },
    },
    {
      id: "status",
      header: "حالة المشروع",
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
      header: "جهة التعاقد",
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
    },
    {
      id: "code",
      header: "كود المشروع",
      accessorKey: "code",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.code}</span>
      ),
    },
    {
      id: "startDate",
      header: "تاريخ بدء المشروع",
      accessorKey: "startDate",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">
          {formatDate(row.original.startDate)}
        </span>
      ),
    },
    {
      id: "location",
      header: "موقع المشروع",
      accessorKey: "location",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.location}</span>
      ),
    },
    {
      id: "landArea",
      header: "مساحة المشروع",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Can action="projects:read">
            <NavLink to={`/projects/read/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <BsEye className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          <Can action="users:update">
            <NavLink to={`/projects/update/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors">
                <BiEdit className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          {/* <Can action="users:delete">
            <button
              onClick={() => handelDelete(row.original._id)}
              className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
            >
              <BsTrash2 className="w-4 h-4" />
            </button>
          </Can> */}
        </div>
      ),
    },
  ];
  // if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle
          title="ادارة المشروعات"
          subTitle="يمكنك التحكم في المشروعات من هنا"
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
          <Can action="projects:create">
            <Button
              onClick={() => navigate("/projects/create")}
              icon={<FaPlus />}
            >
              اضافة مشروع
            </Button>
          </Can>
        </div>
      </div>
      <div className="flex items-center justify-between py-2 px-4 bg-base my-4 rounded-xl">
        {/* search */}
        <div className="w-1/4 border-e border-gray-400 pe-4 me-4">
          <SearchInput
            // fields={fields}
            // suggestions={suggestions}
            selectedField={searchField}
            onChangeText={setSearchString}
            onSelectSuggestion={(value) => setGlobalFilter(value)}
            onSearchFieldChange={(value) => {
              setSearchField(value);
              setSearchString("");
            }}
          />
        </div>
        {/* another filters */}
        <div className="flex flex-1 justify-between gap-4 items-center">
          <div className="flex gap-2 flex-1 items-center">
            {/* tab */}
            <div>
              <span className="text-xs px-2 py-1 block">جهة التعاقد</span>
              <div
                className="inline-flex rounded-lg shadow-xs -space-x-px bg-primary-100 text-primary-content-100 p-2"
                role="group"
              >
                <button
                  onClick={() => setTab("CIVILIAN")}
                  type="button"
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    tab === "CIVILIAN"
                      ? "bg-primary-500 text-primary-content-500"
                      : ""
                  }`}
                >
                  جهة مدنية
                </button>
                <button
                  onClick={() => setTab("MILITARY")}
                  type="button"
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    tab === "MILITARY"
                      ? "bg-primary-500 text-primary-content-500"
                      : ""
                  }`}
                >
                  جهة عسكرية
                </button>
                <button
                  onClick={() => setTab("BUDGET")}
                  type="button"
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    tab === "BUDGET"
                      ? "bg-primary-500 text-primary-content-500"
                      : ""
                  }`}
                >
                  جهة موازنة
                </button>
                <button
                  onClick={() => setTab("")}
                  type="button"
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    tab === "" ? "bg-primary-500 text-primary-content-500" : ""
                  }`}
                >
                  الكل
                </button>
              </div>
            </div>
            {/* statue */}
            <div className="w-40">
              <span className="text-xs px-2 py-1">حالة المشروع</span>
              <AppSelect
                options={[
                  {
                    value: "",
                    label: "الكل",
                  },
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
                    label: "منتهي",
                  },
                ]}
                label=""
                value={status}
                onChange={setStatus}
                isClearable={false}
              />
            </div>
          </div>

          {/* refresh button */}
          <Button
            disabled={isLoading}
            onClick={() => refetch()}
            className="h-fit"
          >
            <FiRefreshCcw className={`${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
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
