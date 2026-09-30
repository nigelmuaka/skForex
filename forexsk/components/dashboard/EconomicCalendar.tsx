"use client";

const events = [
  {
    time: "08:30",
    country: "🇺🇸 USD",
    event: "Non Farm Payrolls",
    impact: "High",
  },
  {
    time: "10:00",
    country: "🇪🇺 EUR",
    event: "ECB Interest Rate",
    impact: "High",
  },
  {
    time: "13:30",
    country: "🇬🇧 GBP",
    event: "GDP Growth",
    impact: "Medium",
  },
  {
    time: "15:00",
    country: "🇯🇵 JPY",
    event: "BOJ Statement",
    impact: "Low",
  },
];

export default function EconomicCalendar() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24]">

      <div className="border-b border-zinc-800 p-5">

        <h2 className="text-xl font-bold">
          Economic Calendar
        </h2>

        <p className="text-zinc-500 text-sm">
          Important Market Events
        </p>

      </div>

      <div className="divide-y divide-zinc-800">

        {events.map((event) => (

          <div
            key={event.time}
            className="flex items-center justify-between p-4 hover:bg-zinc-900 transition"
          >

            <div>

              <div className="font-semibold">
                {event.event}
              </div>

              <div className="text-sm text-zinc-500">
                {event.country}
              </div>

            </div>

            <div className="text-right">

              <div className="font-semibold">
                {event.time}
              </div>

              <div
                className={`text-sm ${
                  event.impact === "High"
                    ? "text-red-500"
                    : event.impact === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {event.impact}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}