import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import getFileUrl from "../../../utils/getDownladLink";
import { FaDownload, FaFile } from "react-icons/fa";
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
        <div>
          <h6 className="text-lg font-semibold">
            اسم البروتوكول:
            <span className="ms-2 font-normal">{protocol.name}</span>
          </h6>
          <p className="text-sm opacity-80">
            قيمة البروتوكول:
            <span className="ms-2">{protocol.value}</span>
          </p>
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
          isOpen ? "max-h-[1000px] p-4 pt-0" : "max-h-0"
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
              />
              <Info
                label="حوافز"
                value={protocol.planningBudget?.incentivesPercentage}
              />
              <Info
                label="إهلاك عمالة"
                value={protocol.planningBudget?.laborDepreciationPercentage}
              />
              <Info
                label="فائض عام"
                value={protocol.planningBudget?.generalSurplusPercentage}
              />
              <Info
                label="الإجمالي"
                value={protocol.planningBudget?.total}
                className="col-span-full"
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
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, className }) {
  return (
    <div
      className={`flex justify-between bg-primary-100 text-primary-content-100 rounded px-2 py-1 dark:bg-primary-800 dark:text-primary-content-800 ${className}`}
    >
      <span>{label}</span>
      <span className="font-semibold">
        {value !== undefined ? `${value}%` : "---"}
      </span>
    </div>
  );
}
