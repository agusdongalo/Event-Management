"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tier = "VIP" | "PREMIUM" | "STANDARD";

const tierOptions: { value: Tier; label: string; description: string }[] = [
  { value: "VIP", label: "VIP", description: "Priority seating + concierge access." },
  { value: "PREMIUM", label: "Premium", description: "Preferred access and lounge perks." },
  { value: "STANDARD", label: "Standard", description: "General access ticket." },
];

type Props = {
  eventId: string;
  seatsLeft: number;
  registeredTier: Tier | null;
  registrationStatus:
    | "PENDING"
    | "APPROVED"
    | "REGISTERED"
    | "REJECTED"
    | "CANCELLED"
    | null;
};

export default function EventRegisterClient({
  eventId,
  seatsLeft,
  registeredTier,
  registrationStatus,
}: Props) {
  const router = useRouter();
  const [tier, setTier] = useState<Tier>(registeredTier ?? "STANDARD");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const isPending = registrationStatus === "PENDING";
  const isApproved = registrationStatus === "APPROVED" || registrationStatus === "REGISTERED";
  const isRejected = registrationStatus === "REJECTED";
  const isLocked = isPending || isApproved || isRejected;

  const handleSubmit = async () => {
    if (isLocked) {
      setError(
        isPending
          ? "Your registration is awaiting organizer approval."
          : isRejected
            ? "Registration was declined. Please contact the organizer."
            : "You are already registered."
      );
      return;
    }
    if (seatsLeft <= 0) {
      setError("This event is fully booked.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, tier }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Unable to register.");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Unable to register.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-[#2a3248] bg-[#12192a] p-5 text-[#f3eee6] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Registration</p>
      <h3 className="mt-2 text-2xl font-semibold text-[#f6e7c8]">Choose your tier</h3>
      <div className="mt-4 grid gap-3">
        {tierOptions.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
              tier === option.value
                ? "border-[#d8b26f] bg-[#0f1527]"
                : "border-[#2a3248] bg-[#0b111f] hover:border-[#3a4663]"
            }`}
          >
            <input
              type="radio"
              name="tier"
              value={option.value}
              checked={tier === option.value}
              onChange={() => setTier(option.value)}
              disabled={isLocked}
              className="mt-1"
            />
            <div>
              <p className="text-sm font-semibold text-[#f6e7c8]">{option.label}</p>
              <p className="text-xs text-[#b8bfd3]">{option.description}</p>
            </div>
          </label>
        ))}
      </div>
      {isPending ? (
        <p className="mt-3 text-sm text-amber-300">
          Request sent. Waiting for organizer confirmation.
        </p>
      ) : null}
      {isApproved ? (
        <p className="mt-3 text-sm text-emerald-300">Registration confirmed.</p>
      ) : null}
      {isRejected ? (
        <p className="mt-3 text-sm text-rose-300">
          Registration was declined. Please contact the organizer.
        </p>
      ) : null}
      {!isLocked && error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      {!isLocked && success ? (
        <p className="mt-3 text-sm text-emerald-300">Request submitted.</p>
      ) : null}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || seatsLeft <= 0 || isLocked}
        className="mt-5 w-full rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-4 py-3 text-sm font-semibold text-[#151515] shadow-[0_12px_30px_rgba(216,178,111,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isApproved
          ? "Already Registered"
          : isPending
            ? "Awaiting Approval"
            : isRejected
              ? "Registration Declined"
          : seatsLeft <= 0
            ? "Sold Out"
            : isSubmitting
              ? "Registering..."
              : "Register Now"}
      </button>
    </div>
  );
}
