import React, { useEffect, useState } from "react";
import Modal from "../../ui/Modal/Modal";
import { FaPlus, FaTrash } from "react-icons/fa";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import FileInput from "../../ui/FileInput/FileInput";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createProtocol,
  updateImplementationRate,
  updateProtocol,
} from "../../../api/protocolsAPI.js";
import {
  createPlanningBudget,
  updatePlanningBudget,
} from "../../../api/planningBudgetAPI.js";
import {
  createCashFlow,
  updateCashFlow,
  deleteCashFlow,
} from "../../../api/cashFlowAPI.js";
import { LuLoader } from "react-icons/lu";
import Swal from "sweetalert2";
import {
  createPaymentOrder,
  deletePaymentOrder,
  updatePaymentOrder,
} from "../../../api/paymentOrder.js";

export default function AddProtocolModal({
  projectID,
  isOpen,
  onClose,
  mode = "create", // "create" | "update"
  initialData = null,
}) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [createdProtocolID, setCreatedProtocolID] = useState(null);

  const protocolID = mode === "update" ? initialData?.id : createdProtocolID;

  const isUpdateMode = mode === "update";
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isUpdateMode
      ? {
          name: initialData?.name || "",
          value: initialData?.value || "",
          file: [], // new file only
          cashFlows:
            initialData?.cashFlows?.length > 0
              ? initialData.cashFlows.map((cf) => ({
                  cashID: cf._id,
                  notes: cf.notes || "",
                  completionPercentage: cf.completionPercentage || "",
                  withdrawalPercentage: cf.withdrawalPercentage || "",
                }))
              : [
                  {
                    notes: "",
                    completionPercentage: "",
                    withdrawalPercentage: "",
                  },
                ],
          urgentWorksPercentage:
            initialData?.planningBudget?.urgentWorksPercentage || "",
          incentivesPercentage:
            initialData?.planningBudget?.incentivesPercentage || "",
          laborDepreciationPercentage:
            initialData?.planningBudget?.laborDepreciationPercentage || "",
          generalSurplusPercentage:
            initialData?.planningBudget?.generalSurplusPercentage || "",
        }
      : {
          name: "",
          value: "",
          file: [],
          cashFlows: [
            { notes: "", completionPercentage: "", withdrawalPercentage: "" },
          ],
          urgentWorksPercentage: "",
          incentivesPercentage: "",
          laborDepreciationPercentage: "",
          generalSurplusPercentage: "",
          paymentOrders: [{ number: "", value: "", date: "", file: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cashFlows",
  });

  const {
    fields: paymentOrderFields,
    append: paymentOrderAppend,
    remove: paymentOrderRemove,
  } = useFieldArray({
    control,
    name: "paymentOrders",
  });

  const urgent = Number(
    useWatch({ control, name: "urgentWorksPercentage" }) || 0
  );
  const incentives = Number(
    useWatch({ control, name: "incentivesPercentage" }) || 0
  );
  const labor = Number(
    useWatch({ control, name: "laborDepreciationPercentage" }) || 0
  );
  const general = Number(
    useWatch({ control, name: "generalSurplusPercentage" }) || 0
  );
  const totalPercentage = urgent + incentives + labor + general;

  // ── Mutations ───────────────────────────────────────────────────────────────

  const { mutate: createProtocolMutate, isPending: creatingProtocol } =
    useMutation({
      mutationFn: createProtocol,
      onSuccess: (res) => {
        setCreatedProtocolID(res.data.id);
        setStep(2);
        toast.success("تم إنشاء البروتوكول بنجاح");
      },
    });

  const { mutate: updateProtocolMutate, isPending: updatingProtocol } =
    useMutation({
      mutationFn: updateProtocol,
      onSuccess: () => {
        toast.success("تم تعديل البروتوكول بنجاح");
        setStep(2);
      },
    });

  const { mutateAsync: createCashFlowMutate } = useMutation({
    mutationFn: createCashFlow,
  });

  const { mutateAsync: updateCashFlowMutate } = useMutation({
    mutationFn: updateCashFlow,
  });
  const { mutateAsync: deleteCashFlowMutate } = useMutation({
    mutationFn: deleteCashFlow,
    onSuccess: () => {
      toast.success("تم حذف التدفق المالي");
      queryClient.invalidateQueries(["protocol", protocolID]);
    },
  });

  const { mutateAsync: createPaymentOrderMutate } = useMutation({
    mutationFn: createPaymentOrder,
    onSuccess: () => {
      toast.success("تم اضافة اوامر الدفع");
    },
  });
  const { mutateAsync: updatePaymentOrderMutate } = useMutation({
    mutationFn: updatePaymentOrder,
    onSuccess: () => {
      toast.success("تم تعديل امر الدفع");
    },
    onError: () => {
      toast.error("حدث خطاء اثناء تعديل امر الدفع");
    },
  });
  const { mutateAsync: deletePaymentOrderMutate } = useMutation({
    mutationFn: deletePaymentOrder,
    onSuccess: () => {
      toast.success("تم حذف  امر الدفع");
      queryClient.invalidateQueries(["protocol", protocolID]);
    },
  });

  const { mutate: createPlanningBudgetMutate, isPending: creatingBudget } =
    useMutation({
      mutationFn: createPlanningBudget,
      onSuccess: () => {
        toast.success("تم حفظ الموازنة التخطيطية بنجاح");
        handleSuccessClose();
      },
    });

  const { mutate: updatePlanningBudgetMutate, isPending: updatingBudget } =
    useMutation({
      mutationFn: updatePlanningBudget,
      onSuccess: () => {
        toast.success("تم تعديل الموازنة التخطيطية بنجاح");
        setStep(4);
      },
    });
  const {
    mutate: updateImplementationRateMutate,
    isPending: updatingImplementationRate,
  } = useMutation({
    mutationFn: updateImplementationRate,
    onSuccess: () => {
      toast.success("تم تعديل نسبة التنفيذ  بنجاح");
      setStep(2);
    },
  });

  const isLoading =
    creatingProtocol ||
    updatingProtocol ||
    creatingBudget ||
    updatingImplementationRate ||
    updatingBudget;
  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDeleteCashFlow = async (index, cashFlow) => {
    console.log("index", index, "cashFlow", cashFlow);
    if (!cashFlow.cashID) {
      remove(index);
      toast("تم إزالة التدفق الجديد", { icon: "ℹ️" });
      return;
    }

    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف التدفق المالي نهائياً",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "إلغاء",
      confirmButtonText: "نعم، احذف",
    });

    if (!result.isConfirmed) return;
    try {
      await deleteCashFlowMutate(cashFlow.cashID);
      remove(index);
    } catch (error) {
      // toast already handled in onError
      console.error("Delete cash flow error:", error);
    }
  };
  const handleDeletePaymentOrder = async (index, paymentOrder) => {
    if (!paymentOrder.paymentOrderID) {
      paymentOrderRemove(index);
      toast("تم إزالة التدفق الجديد", { icon: "ℹ️" });
      return;
    }

    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف امر الدفع نهائياً",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "إلغاء",
      confirmButtonText: "نعم، احذف",
    });

    if (!result.isConfirmed) return;
    try {
      await deletePaymentOrderMutate(paymentOrder.paymentOrderID);
      paymentOrderRemove(index);
    } catch (error) {
      // toast already handled in onError
      console.error("Delete payment order error:", error);
    }
  };
  const onSubmit = async (data) => {
    try {
      // Step 1: Protocol
      if (step === 1) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("value", data.value);
        formData.append("project", projectID);
        formData.append("currentPercentage", data.currentPercentage);
        formData.append("currentDate", data.currentDate);

        if (data.file?.[0]) {
          formData.append("file", data.file[0]);
        }

        if (isUpdateMode) {
          updateProtocolMutate({ id: protocolID, formData });
          if (data.currentPercentage !== initialData?.currentPercentage) {
            updateImplementationRateMutate({
              id: protocolID,
              data: {
                currentPercentage: data.currentPercentage,
                currentDate:
                  data.currentDate || new Date().toISOString().split("T")[0],
              },
            });
          }
        } else {
          createProtocolMutate(formData);
        }
        return;
      }

      // Step 2: Cash Flows (add / update / delete)
      if (step === 2) {
        const promises = [];

        // Handle each cash flow
        for (const cashFlow of data.cashFlows) {
          const payload = {
            notes: cashFlow.notes,
            completionPercentage: Number(cashFlow.completionPercentage),
            withdrawalPercentage: Number(cashFlow.withdrawalPercentage),
            protocol: protocolID,
          };

          if (cashFlow.cashID) {
            await updateCashFlowMutate({
              id: cashFlow.cashID,
              data: payload,
            });
          } else {
            await createCashFlowMutate(payload);
          }
        }

        await Promise.all(promises);
        toast.success("تم حفظ التدفقات المالية بنجاح");
        setStep(3);
        return;
      }

      // Step 3: Planning Budget
      if (step === 3) {
        if (totalPercentage > 100) {
          toast.error("مجموع النسب لا يجب أن يتجاوز 100%");
          return;
        }

        const budgetData = {
          urgentWorksPercentage: Number(data.urgentWorksPercentage),
          incentivesPercentage: Number(data.incentivesPercentage),
          laborDepreciationPercentage: Number(data.laborDepreciationPercentage),
          generalSurplusPercentage: Number(data.generalSurplusPercentage),
          protocol: protocolID,
        };

        if (isUpdateMode && initialData?.planningBudget?.id) {
          updatePlanningBudgetMutate({
            id: initialData.planningBudget.id,
            data: budgetData,
          });
        } else {
          createPlanningBudgetMutate(budgetData);
        }
      }
      // Step 4: Payment Orders
      if (step === 4) {
        const promises = [];
        console.log(data.paymentOrders);
        // Handle each cash flow
        for (const paymentOrder of data.paymentOrders) {
          console.log(paymentOrder.file[0]);
          const payload = {
            number: Number(paymentOrder.number),
            value: Number(paymentOrder.value),
            date: paymentOrder.date,
            file: paymentOrder.file[0],
            protocol: protocolID,
          };
          console.log(paymentOrder);
          if (paymentOrder.paymentOrderID) {
            await updatePaymentOrderMutate({
              id: paymentOrder.paymentOrderID,
              data: payload,
            });
          } else {
            await createPaymentOrderMutate(payload);
          }
        }

        await Promise.all(promises);
        toast.success("تم حفظ  اوامر الدفع بنجاح");
        handleClose();
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleSuccessClose = () => {
    queryClient.invalidateQueries({ queryKey: ["protocols", projectID] });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setCreatedProtocolID(null);
    setStep(1);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    if (isUpdateMode && initialData) {
      reset({
        name: initialData.name || "",
        value: initialData.value || "",
        file: [],
        currentDate:
          initialData?.currentDate?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        currentPercentage: initialData.currentPercentage || "0",
        cashFlows: initialData.cashFlows?.length
          ? initialData.cashFlows.map((cf) => ({
              cashID: cf._id,
              notes: cf.notes || "",
              completionPercentage: cf.completionPercentage || "",
              withdrawalPercentage: cf.withdrawalPercentage || "",
            }))
          : [{ notes: "", completionPercentage: "", withdrawalPercentage: "" }],
        paymentOrders: initialData.paymentOrders?.length
          ? initialData.paymentOrders.map((cf) => ({
              paymentOrderID: cf._id,
              number: cf.number || "",
              value: cf.value || "",
              date: cf.date.split("T")[0] || "",
              file: [],
            }))
          : [{ number: "", value: "", date: "", file: [] }],
        urgentWorksPercentage:
          initialData.planningBudget?.urgentWorksPercentage || "",
        incentivesPercentage:
          initialData.planningBudget?.incentivesPercentage || "",
        laborDepreciationPercentage:
          initialData.planningBudget?.laborDepreciationPercentage || "",
        generalSurplusPercentage:
          initialData.planningBudget?.generalSurplusPercentage || "",
      });
    } else {
      reset({
        name: "",
        value: "",
        file: [],
        cashFlows: [
          { notes: "", completionPercentage: "", withdrawalPercentage: "" },
        ],
        currentDate: new Date().toISOString().split("T")[0],
        currentPercentage: "0",
        paymentOrders: [{ number: "", value: "", date: "", file: [] }],
        urgentWorksPercentage: "",
        incentivesPercentage: "",
        laborDepreciationPercentage: "",
        generalSurplusPercentage: "",
      });
    }
  }, [isOpen, isUpdateMode, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isUpdateMode ? "تعديل البروتوكول" : "إضافة بروتوكول جديد"}
      size="xl"
      closeOnOverlayClick={false}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LuLoader className="animate-spin" size={48} />
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-body bg-primary-100 text-primary-content-100/60 dark:bg-primary-800 dark:text-primary-content-800/60 border border-primary-500 rounded-lg shadow-xs sm:p-4 sm:space-x-4">
              <li
                onClick={() => {
                  if (isUpdateMode && step !== 1) setStep(1);
                }}
                className={`flex items-center ${
                  step === 1 &&
                  "text-primary-content-100 dark:text-primary-content-800"
                }
                 ${step !== 1 && isUpdateMode && "cursor-pointer"}`}
              >
                <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-brand rounded-full shrink-0">
                  1
                </span>
                <span className="hidden sm:inline-flex me-2">
                  {isUpdateMode ? "تعديل" : "اضافة"}
                </span>
                بروتوكول
                <svg
                  className="w-5 h-5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m7 16 4-4-4-4m6 8 4-4-4-4"
                  />
                </svg>
              </li>
              <li
                onClick={() => {
                  if (isUpdateMode && step !== 2) setStep(2);
                }}
                className={`flex items-center ${
                  step === 2 &&
                  "text-primary-content-100 dark:text-primary-content-800"
                }
                 ${step !== 2 && isUpdateMode && "cursor-pointer"}`}
              >
                <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-body rounded-full shrink-0">
                  2
                </span>
                <span className="hidden sm:inline-flex me-2">
                  {isUpdateMode ? "تعديل" : "اضافة"}
                </span>
                التدفقات المالية
                <svg
                  className="w-5 h-5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m7 16 4-4-4-4m6 8 4-4-4-4"
                  />
                </svg>
              </li>
              <li
                onClick={() => {
                  if (isUpdateMode && step !== 3) setStep(3);
                }}
                className={`flex items-center ${
                  step === 3 &&
                  "text-primary-content-100 dark:text-primary-content-800"
                }
                 ${step !== 3 && isUpdateMode && "cursor-pointer"}`}
              >
                <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-body rounded-full shrink-0">
                  3
                </span>
                <span className="hidden sm:inline-flex me-2">
                  {isUpdateMode ? "تعديل" : "اضافة"}
                </span>
                الموازنة التخطيطية
                <svg
                  className="w-5 h-5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m7 16 4-4-4-4m6 8 4-4-4-4"
                  />
                </svg>
              </li>
              <li
                onClick={() => {
                  if (isUpdateMode && step !== 4) setStep(4);
                }}
                className={`flex items-center ${
                  step === 4 &&
                  "text-primary-content-100 dark:text-primary-content-800"
                }
                 ${step !== 4 && isUpdateMode && "cursor-pointer"}`}
              >
                <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-body rounded-full shrink-0">
                  4
                </span>
                <span className="hidden sm:inline-flex me-1">
                  {isUpdateMode ? "تعديل" : "اضافة"}
                </span>
                اوامر الدفع
              </li>
            </ol>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1 - Protocol basic info */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  rules={{ required: "هذا الحقل مطلوب" }}
                  label="اسم البروتوكول"
                  {...register("name", { required: "هذا الحقل مطلوب" })}
                  error={errors.name}
                />
                <Input
                  rules={{ required: "هذا الحقل مطلوب" }}
                  label="قيمة البروتوكول"
                  {...register("value", { required: "هذا الحقل مطلوب" })}
                  error={errors.value}
                />
                <div className="col-span-full">
                  <FileInput
                    label="ملف البروتوكول (اختياري - للتعديل يستبدل الملف الحالي)"
                    id="protocol-file"
                    {...register("file")}
                  />
                </div>
                <Input
                  type="number"
                  rules={{ required: "هذا الحقل مطلوب" }}
                  label="نسبة التنفيذ"
                  {...register("currentPercentage", {
                    required: "هذا الحقل مطلوب",
                    min: {
                      value: 0,
                      message: "لا يمكن ان يكون نسبة التنفيذ اقل من 0%",
                    },
                    max: {
                      value: 100,
                      message: "لا يمكن ان يكون نسبة التنفيذ اكبر من 100%",
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.currentPercentage}
                />
                <Input
                  type="date"
                  rules={{ required: "هذا الحقل مطلوب" }}
                  label="نسبة التنفيذ"
                  {...register("currentDate", {
                    required: "هذا الحقل مطلوب",
                  })}
                  error={errors.currentDate}
                />
              </div>
            )}

            {/* Step 2 - Cash Flows */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">التدفقات المالية</h3>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end border-b pb-4"
                  >
                    <Input
                      label="الملاحظة"
                      {...register(`cashFlows.${index}.notes`, {
                        required: "مطلوب",
                      })}
                      error={errors.cashFlows?.[index]?.notes}
                    />
                    <Input
                      label="نسبة التنفيذ %"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...register(`cashFlows.${index}.completionPercentage`, {
                        required: "مطلوب",
                        min: { value: 0, message: "الحد الأدنى 0" },
                        max: { value: 100, message: "الحد الأقصى 100" },
                      })}
                      error={errors.cashFlows?.[index]?.completionPercentage}
                    />
                    <Input
                      label="نسبة الصرف %"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...register(`cashFlows.${index}.withdrawalPercentage`, {
                        required: "مطلوب",
                        min: { value: 0, message: "الحد الأدنى 0" },
                        max: { value: 100, message: "الحد الأقصى 100" },
                      })}
                      error={errors.cashFlows?.[index]?.withdrawalPercentage}
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCashFlow(index, field)}
                      icon={<FaTrash />}
                    >
                      حذف
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({
                      notes: "",
                      completionPercentage: "",
                      withdrawalPercentage: "",
                    })
                  }
                  icon={<FaPlus />}
                >
                  إضافة تدفق مالي جديد
                </Button>
              </div>
            )}

            {/* Step 3 - Planning Budget Percentages */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold">
                  توزيع الموازنة التخطيطية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="نسبة الأعمال العاجلة %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...register("urgentWorksPercentage", {
                      required: "مطلوب",
                      min: 0,
                      max: 100,
                    })}
                    error={errors.urgentWorksPercentage}
                  />
                  <Input
                    label="نسبة الحوافز %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...register("incentivesPercentage", {
                      required: "مطلوب",
                      min: 0,
                      max: 100,
                    })}
                    error={errors.incentivesPercentage}
                  />
                  <Input
                    label="نسبة الاستهلاك العمالي %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...register("laborDepreciationPercentage", {
                      required: "مطلوب",
                      min: 0,
                      max: 100,
                    })}
                    error={errors.laborDepreciationPercentage}
                  />
                  <Input
                    label="نسبة الفائض العام %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...register("generalSurplusPercentage", {
                      required: "مطلوب",
                      min: 0,
                      max: 100,
                    })}
                    error={errors.generalSurplusPercentage}
                  />
                </div>

                <div
                  className={`text-lg font-bold ${
                    totalPercentage > 100 ? "text-red-600" : "text-green-700"
                  }`}
                >
                  المجموع: {totalPercentage.toFixed(2)}%
                </div>
              </div>
            )}
            {/* step 4 - Payment Order */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">اوامر الدفع</h3>
                  <div className="font-light text-xs bg-primary-500 text-primary-content-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <span>{paymentOrderFields.length}</span>
                  </div>
                </div>

                {paymentOrderFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border p-4 border-dashed rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="رقم امر الدفع"
                        type="number"
                        {...register(`paymentOrders.${index}.number`, {
                          required: "رقم امر الدفع مطلوب",
                        })}
                        rules={{ required: true }}
                        error={errors.paymentOrders?.[index]?.number}
                      />
                      <Input
                        label="قيمة امر الدفع"
                        type="number"
                        {...register(`paymentOrders.${index}.value`, {
                          required: "قيمة امر الدفع مطلوب",
                        })}
                        rules={{ required: true }}
                        error={errors.paymentOrders?.[index]?.value}
                      />
                      <Input
                        label="رقم امر الدفع"
                        type="date"
                        {...register(`paymentOrders.${index}.date`, {
                          required: "تاريخ امر الدفع مطلوب",
                        })}
                        rules={{ required: true }}
                        error={errors.paymentOrders?.[index]?.date}
                      />
                      <div className="col-span-full">
                        <FileInput
                          label="ملف امر الدفع"
                          id={`paymentOrders.${index}.file`}
                          accept=".pdf,.docx"
                          {...register(`paymentOrders.${index}.file`, {
                            required: "الملف مطلوب",
                          })}
                        />
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="danger"
                          disabled={paymentOrderFields.length === 1}
                          onClick={() => handleDeletePaymentOrder(index, field)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={paymentOrderAppend}>
                  اضافة
                </Button>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                إلغاء
              </Button>

              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep((prev) => prev - 1)}
                  >
                    السابق
                  </Button>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <LuLoader className="animate-spin" />
                  ) : step === 4 ? (
                    isUpdateMode ? (
                      "حفظ التعديلات"
                    ) : (
                      "إنهاء وإضافة"
                    )
                  ) : (
                    "التالي"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
