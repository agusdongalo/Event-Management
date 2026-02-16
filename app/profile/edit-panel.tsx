"use client";

import { useState } from "react";
import ProfileForm from "./profile-form";

type Props = {
  headingClassName: string;
  initialName: string;
  initialEmail: string;
};

export default function EditPanel({ headingClassName, initialName, initialEmail }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-[#d8b26f] transition hover:text-[#f6e7c8]"
      >
        Edit Profile
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className={`${headingClassName} text-2xl text-[#f6e7c8]`}>
                Edit details
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#ead8b4] bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8efde] transition hover:bg-black/55"
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <ProfileForm initialName={initialName} initialEmail={initialEmail} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
