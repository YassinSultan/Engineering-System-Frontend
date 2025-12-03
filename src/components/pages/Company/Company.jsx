import React, { useMemo, useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { FaDownload, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getCompanies, suggestionFilter } from "../../../api/companyAPI";
import SearchInput from "../../ui/SearchInput/SearchInput";
import { BsEye, BsFileText, BsTrash2 } from "react-icons/bs";
import { BiEdit, BiFolder } from "react-icons/bi";
import { NavLink } from "react-router";
import DataTable from "../../common/DataTabel/DataTable";
const fields = [
  {
    value: "companyCode",
    label: "كود الشركة",
  },
  {
    value: "companyName",
    label: "اسم الشركة",
  },
  {
    value: "commercialRegister",
    label: " رقم السجل التجاري",
  },
  {
    value: "securityApprovalNumber",
    label: " رقم الموافقة الامنية",
  },
  {
    value: "companyCategory",
    label: "فئة الشركة",
  },
  {
    value: "companyBrand",
    label: "السمة التجارية للشركة",
  },
  {
    value: "companyActivity",
    label: "نشاط الشركة",
  },
  {
    value: "ownerName",
    label: "اسم مالك الشركة",
  },
  {
    value: "ownerNID",
    label: "رقم الهوية لمالك الشركة",
  },
  {
    value: "representativeName",
    label: "اسم المنوب",
  },
  {
    value: "legalForm",
    label: "الشكل القانوني",
  },
  {
    value: "fiscalYear",
    label: "العام المالي",
  },
];
export default function Company() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState("all"); // default field
  const [searchString, setSearchString] = useState(""); //filter Search
  const [globalFilter, setGlobalFilter] = useState(""); //real filter after user click button or select suggestion
  const [sorting, setSorting] = useState([]);

  const { data: res, isLoading } = useQuery({
    queryKey: ["companies", pageIndex, pageSize, globalFilter, sorting],
    queryFn: () =>
      getCompanies({
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
  });
  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", searchField, searchString],
    queryFn: () => suggestionFilter(searchField, { search: searchString }),
    enabled: searchString.length > 1, // مشتغلش إلا لما يكتب كفاية
  });

  //   table coulmn
  const columns = useMemo(() => [
    {
      id: "companyCode",
      header: "كود الشركة",
      accessorKey: "companyCode",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.companyCode}
        </span>
      ),
    },
    {
      id: "companyName",
      header: "اسم الشركة",
      accessorKey: "companyName",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          {row.original.companyName}
        </span>
      ),
    },
    {
      id: "commercialRegister",
      header: "رقم السجل",
      accessorKey: "commercialRegister",
    },
    {
      id: "companyCategory",
      header: "فئة الشركة",
      accessorKey: "companyCategory",
      cell: ({ row }) => (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
          {row.original.companyCategory}
        </span>
      ),
    },
    {
      id: "ownerName",
      header: "مالك الشركة",
      accessorKey: "ownerName",
    },
    {
      id: "legalForm",
      header: "الشكل القانوني",
      accessorKey: "legalForm",
    },
    {
      id: "phones",
      header: "التليفونات",
      accessorKey: "phones",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.phones?.join(" | ") || "-"}
        </span>
      ),
    },
    {
      id: "files",
      header: "الملفات",
      enableSorting: false,
      cell: ({ row }) => {
        const hasApprovalFile = !!row.original.securityApprovalFile;
        const documentsCount = row.original.companyDocuments?.length || 0;
        const totalFiles = (hasApprovalFile ? 1 : 0) + documentsCount;

        if (totalFiles === 0) {
          return <span className="text-muted-foreground text-xs">لا يوجد</span>;
        }

        return (
          <div className="flex items-center justify-center gap-2">
            {hasApprovalFile && (
              <button
                onClick={() => console.log(row.original.securityApprovalFile)}
                className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors"
                title="الموافقة الأمنية"
              >
                <BsFileText className="w-4 h-4" />
              </button>
            )}
            {documentsCount > 0 && (
              <button
                onClick={() => console.log(row.original.companyDocuments)}
                className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                title="أوراق الشركة"
              >
                <BiFolder className="w-4 h-4" />
                <span className="text-xs font-medium">{documentsCount}</span>
              </button>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <NavLink to={`/company/view/${row.original._id}`}>
            <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <BsEye className="w-4 h-4" />
            </button>
          </NavLink>
          <NavLink to={`/company/edit/${row.original._id}`}>
            <button className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors">
              <BiEdit className="w-4 h-4" />
            </button>
          </NavLink>
          <button
            onClick={() => console.log(row.original._id)}
            className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
          >
            <BsTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]);
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle
          title="ادارة الشركات"
          subTitle="عرض وإدارة جميع الشركات المسجلة في النظام"
        />
        <div className="flex gap-2">
          <Button variant="secondary" icon={<FaDownload />}>
            تصدير اكسيل
          </Button>
          <Button icon={<FaPlus />}>اضافة شركة</Button>
        </div>
      </div>
      <div className="w-1/2">
        <SearchInput
          fields={fields}
          suggestions={suggestions}
          selectedField={searchField}
          onChangeText={setSearchString}
          onSelectSuggestion={(value) => setGlobalFilter(value)}
          onSearchFieldChange={(value) => {
            setSearchField(value);
            setSearchString("");
          }}
        />
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
        />
      </div>
    </>
  );
}
