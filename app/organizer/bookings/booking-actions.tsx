"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  registrationId: string;
  status: "PENDING" | "APPROVED" | "REGISTERED" | "REJECTED" | "CANCELLED";
};

export default function BookingActions({ registrationId, status }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const updateStatus = async (nextStatus: "APPROVED" | "REJECTED") => {
    setError("");
    try {
      const response = await fetch(`/api/organizer/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, id: registrationId }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "Unable to update booking.");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Unable to update booking.");
    }
  };

  if (status !== "PENDING") {
    return (
      <span className="text-xs text-[#7b86a6]">
        {status === "APPROVED" || status === "REGISTERED"
          ? "Approved"
          : status === "REJECTED"
            ? "Rejected"
            : "Closed"}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => updateStatus("APPROVED")}
          className="rounded-full bg-[#2f8a62] px-3 py-1 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => updateStatus("REJECTED")}
          className="rounded-full bg-[#b74150] px-3 py-1 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Reject
        </button>
      </div>
      {error ? <span className="text-[11px] text-rose-500">{error}</span> : null}
    </div>
  );
}
