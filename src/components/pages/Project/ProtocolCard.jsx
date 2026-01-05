import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import getFileUrl from "../../../utils/getDownladLink";
import { FaCheck, FaDownload, FaFile } from "react-icons/fa";
import Button from "../../ui/Button/Button";

export default function ProtocolCard({ protocol, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-3 rounded-lg border border-primary-500 bg-primary-50 text-primary-content-50 dark:bg-primary-900 dark:text-primary-content-900">
      {/* Header */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between p-4 cursor-pointer select-none"
      >
        <div className="flex gap-4 items-center">
          <div className="pe-2 border-e border-primary-500">
            <h6 className="text-lg font-semibold">
              اسم البروتوكول:
              <span className="ms-2 font-normal">{protocol.name}</span>
            </h6>
            <p className="text-sm opacity-80">
              قيمة البروتوكول:
              <span className="ms-2">{protocol.value}</span>
            </p>
          </div>
          <span className="bg-primary-200/40 dark:bg-primary-700/40 px-4 py-1 border border-primary-500 rounded-full text-xs">
            <span className="me-2">نسبة التنفيذ</span>
            {protocol.currentPercentage} %
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(protocol);
            }}
          >
            تعديل
          </Button>
          <FaChevronDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Body */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px] p-4 pt-0" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md border border-primary-600 p-3 h-fit col-span-full">
            <h6 className="mb-3 font-semibold border-b border-primary-600 pb-1">
              ملف البروتوكول
            </h6>

            <div className="p-3 rounded-md shadow flex justify-between items-center mb-4">
              <div>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(getFileUrl(protocol.file), "_blank")
                  }
                >
                  <FaDownload />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-light">
                    {protocol.file.split("/").pop().split("-")[1]}
                  </span>
                </div>
                <div>
                  <FaFile size={20} className="text-primary-500" />
                </div>
              </div>
            </div>
          </div>
          {/* Planning Budget */}
          <div className="rounded-md border border-primary-600 p-3 h-fit">
            <h6 className="mb-3 font-semibold border-b border-primary-600 pb-1">
              الموازنة التخطيطية
            </h6>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Info
                label="أعمال عاجلة"
                value={protocol.planningBudget?.urgentWorksPercentage}
                after={"%"}
              />
              <Info
                label="حوافز"
                value={protocol.planningBudget?.incentivesPercentage}
                after={"%"}
              />
              <Info
                label="إهلاك عمالة"
                value={protocol.planningBudget?.laborDepreciationPercentage}
                after={"%"}
              />
              <Info
                label="فائض عام"
                value={protocol.planningBudget?.generalSurplusPercentage}
                after={"%"}
              />
              <Info
                label="الإجمالي"
                value={protocol.planningBudget?.total}
                className="col-span-full"
                after={"%"}
              />
            </div>
          </div>

          {/* Cash Flows */}
          <div className="rounded-md border border-primary-600 p-3 h-fit">
            <h6 className="mb-3 font-semibold border-b border-primary-600 pb-1">
              التدفقات المالية
            </h6>

            {protocol.cashFlows?.length ? (
              <div className="flex flex-col gap-2 text-sm">
                {protocol.cashFlows.map((flow, index) => (
                  <div
                    key={index}
                    className="rounded bg-primary-100 text-primary-content-100 p-2 dark:bg-primary-800 dark:text-primary-content-800"
                  >
                    <p>ملاحظة: {flow.notes || "---"}</p>
                    <p>نسبة التنفيذ: {flow.completionPercentage || "---"}%</p>
                    <p>نسبة الصرف: {flow.withdrawalPercentage || "---"}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm opacity-70">لا توجد تدفقات مالية</p>
            )}
          </div>

          {/* paymentsOrders */}
          <div className="rounded-md border border-primary-600 p-3 h-fit col-span-full">
            <h6 className="mb-3 font-semibold border-b border-primary-600 pb-1">
              اوامر الدفع
            </h6>

            {protocol.paymentOrders?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {protocol.paymentOrders.map((p, index) => (
                  <div
                    key={index}
                    className="rounded bg-primary-100 text-primary-content-100 p-2 dark:bg-primary-800 dark:text-primary-content-800"
                  >
                    <Info
                      label="رقم امر الدفع"
                      value={p.number}
                      className="col-span-full"
                    />
                    <Info
                      label="قيمة امر الدفع"
                      value={p.number}
                      className="col-span-full"
                    />
                    <Info
                      label="تاريخ امر الدفع"
                      value={p.date.split("T")[0]}
                      className="col-span-full"
                    />
                    <div className="p-2 border rounded my-2 flex items-center justify-between">
                      <span>ملف امر الدفع</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(getFileUrl(p.file), "_blank")
                        }
                      >
                        <FaDownload />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm opacity-70">لا توجد اوامر دفع </p>
            )}
          </div>
          {/* excutionHistory */}
          <div className="rounded-md border border-primary-600 p-3 h-fit col-span-full">
            <h6 className="mb-3 font-semibold border-b border-primary-600 pb-1">
              سجل التنفيذ
            </h6>
            {protocol.executionHistory?.length ? (
              <ol className="relative border-s ms-4">
                {protocol.executionHistory.map((p, index) => (
                  <li className="mb-10 ms-6" key={index}>
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary-200 text-primary-content-200 rounded-full -start-3 ring-2 ">
                      <FaCheck />
                    </span>
                    <time className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded">
                      {protocol.executionHistory[0].date.split("T")[0]}
                    </time>
                    <h3 className="mt-3">
                      <span>نسبة التنفيذ: {p.percentage}%</span>
                    </h3>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm opacity-70">لا توجد سجلات تنفيذ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, className, after }) {
  return (
    <div
      className={`flex justify-between bg-primary-100 text-primary-content-100 rounded px-2 py-1 dark:bg-primary-800 dark:text-primary-content-800 ${className}`}
    >
      <span>{label}</span>
      <span className="font-semibold">
        {value !== undefined ? `${value}${after || ""}` : "---"}
      </span>
    </div>
  );
}
