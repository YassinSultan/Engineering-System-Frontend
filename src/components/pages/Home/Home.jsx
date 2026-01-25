import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { lazy, Suspense, useState } from "react";
import Loading from "../../common/Loading/Loading";
import { ThreeDot } from "react-loading-indicators";
// import { AsyncPaginate } from "react-select-async-paginate";
const tabs = [
  {
    label: "موقف المشاريع",
    value: "projects_status",
    component: lazy(() => import("./tabs/ProjectsStatus")),
  },
  { label: "موقف الشركات", value: "companies_status" },
  { label: "الموقف المالي", value: "financial_status" },
  { label: "الارتباط والصرف", value: "commitment_payment" },
  { label: "العقود / اوامر التوريد", value: "contracts" },
  { label: "المستخلصات والتسويات", value: "settlements" },
  { label: "الأولويات", value: "priorities" },
  { label: "المقايسات", value: "boq" },
  { label: "طلبات التدبير", value: "procurement_requests" },
  { label: "موقف الخامات مشاريع", value: "materials_projects" },
  { label: "موقف الخامات شركات", value: "materials_companies" },
  { label: "متابعة المهام", value: "tasks" },
  { label: "موقف الافرع والأقسام", value: "branches_departments" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const activeTabData = tabs.find((t) => t.value === activeTab);
  const ActiveTabComponent = activeTabData?.component;
  return (
    <>
      <section>
        <div className="mb-4">
          <PageTitle title="الرئيسية" />
        </div>
        <div className="flex gap-4 mb-4">
          <Button size="lg">اكسيل</Button>
          <Button size="lg" variant="secondary">
            طباعة
          </Button>
        </div>
        <nav className="py-2">
          <ul className="flex flex-wrap xl:flex-nowrap gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <li key={tab.value}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`
              px-4 py-2 text-sm font-medium text-center transition
               cursor-pointer col h-full
              ${isActive ? "border-b-2 border-primary-600 opacity-100" : "opacity-50"}
            `}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="my-4">
          <Suspense
            fallback={
              <div className="h-64 flex justify-center items-center">
                <ThreeDot
                  variant="brick-stack"
                  color="var(--color-primary-600)"
                  size="small"
                  text="جاري التحميل ..."
                  textColor="var(--color-primary-600)"
                />
              </div>
            }
          >
            <div className="p-4 rounded-xl bg-base shadow">
              {ActiveTabComponent ? (
                <ActiveTabComponent />
              ) : (
                <div className="text-center text-red-500">
                  هذا التبويب غير متاح حاليًا
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </section>
    </>
  );
}
