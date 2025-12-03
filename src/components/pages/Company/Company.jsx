import React, { useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { FaDownload, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getCompanies, suggestionFilter } from "../../../api/companyAPI";
import SearchInput from "../../ui/SearchInput/SearchInput";
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
  const [pageSize, setPageSize] = useState(1);
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
    </>
  );
}
