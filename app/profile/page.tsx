import Link from "next/link";
import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditPanel from "./edit-panel";

export const dynamic = "force-dynamic";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const recentActivity = await prisma.registration.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      event: { select: { title: true, startAt: true } },
    },
  });

  return (
    <main
      className={`${bodyFont.className} min-h-screen px-4 py-10 text-[#f3eee6] md:px-10`}
      style={{
        background:
          "radial-gradient(circle at 15% 12%, rgba(216,178,111,0.18), transparent 40%), radial-gradient(circle at 85% 20%, rgba(92,88,126,0.22), transparent 45%), #090b11",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/attendee"
          className="inline-flex items-center gap-2 rounded-full border border-[#ead8b4] bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8efde] transition hover:bg-black/55"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to account
        </Link>

        <div className="mt-6 rounded-3xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#ead8b4] bg-[#0f141f] text-xl font-semibold text-[#f6e7c8]">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>
                {user.name}
              </p>
              <p className="text-sm text-[#9aa4b8]">{user.email}</p>
              <div className="mt-2">
                <EditPanel
                  headingClassName={headingFont.className}
                  initialName={user.name}
                  initialEmail={user.email}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-[#2a3248] bg-[#0f141f] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#d8b26f]">
                Attendee
              </div>
              <div className="rounded-full border border-[#2a3248] bg-[#0f141f] px-4 py-2 text-xs text-[#cbd2e7]">
                Joined {user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Membership</p>
            <p className="mt-2 font-semibold text-[#f3eee6]">Standard Attendee</p>
          </div>
          <div className="rounded-2xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Notifications</p>
            <p className="mt-2 font-semibold text-[#f3eee6]">Email + SMS</p>
          </div>
          <div className="rounded-2xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Payment Method</p>
            <p className="mt-2 font-semibold text-[#f3eee6]">Visa •••• 4242</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <h2 className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>Preferences</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Default</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">City</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Manila</p>
              </div>
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Event type</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Live music</p>
              </div>
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Time slot</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Evenings</p>
              </div>
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Alerts</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Instant</p>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
            <h2 className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>
              Recent activity
            </h2>
            <div className="mt-4 space-y-3 text-sm text-[#cbd2e7]">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">
                      {item.status.toLowerCase()}
                    </p>
                    <p className="mt-2 font-semibold text-[#f3eee6]">{item.event.title}</p>
                    <p className="mt-1 text-xs text-[#9aa4b8]">
                      {item.event.startAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm text-[#9aa4b8]">
                  No recent activity yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
