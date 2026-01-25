"use client";

import { useState } from "react";

type SegmentedToggleProps = {
  options: string[];
  initialIndex?: number;
};

export function SegmentedToggle({ options, initialIndex = 0 }: SegmentedToggleProps) {
  const [active, setActive] = useState(initialIndex);

  return (
    <div className="flex items-center rounded-full bg-[#f2f4ff] p-1 text-[11px] text-[#6b7593] shadow-sm">
      {options.map((item, index) => (
        <button
          key={item}
          type="button"
          onClick={() => setActive(index)}
          aria-pressed={active === index}
          className={`rounded-full px-3 py-1 transition focus:outline-none focus-visible:outline-none ${
            active === index ? "bg-white text-[#3b5dd0] shadow-sm" : "hover:text-[#1b2441]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
