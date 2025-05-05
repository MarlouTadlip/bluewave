"use client";
import { useTransition } from "react";
import { CheckCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export function CheckInForm({
  participationId,
  checkInTime,
  checkOutTime,
  checkInAction,
  checkOutAction,
}: {
  participationId: string;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  checkInAction: (id: string) => Promise<{ success: boolean; message: string }>;
  checkOutAction: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleAction = async (
    action: (id: string) => Promise<{ success: boolean; message: string }>
  ) => {
    startTransition(async () => {
      const result = await action(participationId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex gap-2">
      {!checkInTime && (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleAction(checkInAction)}
          disabled={isPending}
        >
          <CheckCircle className="h-4 w-4" /> Check In
        </button>
      )}
      {checkInTime && !checkOutTime && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleAction(checkOutAction)}
          disabled={isPending}
        >
          <LogOut className="h-4 w-4" /> Check Out
        </button>
      )}
    </div>
  );
}
