import {
  BedDouble,
  Building2,
  CheckCircle2,
  Euro,
  MapPin,
} from "lucide-react";

import {
  getStartingRate,
  getTermConfig,
} from "@/lib/accommodation";

const DEFAULT_FEATURES = [
  "Fully furnished accommodation",
  "Comfortable and secure environment",
  "Excellent public transport connections",
  "High-speed Wi-Fi throughout the property",
];

function formatEuroAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Contact us";
  }

  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function LocationStatCard({
  icon: Icon,
  value,
  unit,
  description,
}) {
  return (
    <article
      className="
        flex h-full min-h-[250px] min-w-0 flex-col
        rounded-3xl border border-slate-200
        bg-slate-50 p-7 shadow-sm
        sm:p-8
      "
    >
      <Icon
        aria-hidden="true"
        className="size-10 shrink-0 text-primary"
        strokeWidth={1.8}
      />

      <div className="mt-7 min-w-0">
        <p
          className="
            break-words text-3xl font-bold
            leading-tight tracking-tight text-slate-950
          "
        >
          {value}
        </p>

        {unit ? (
          <p
            className="
              mt-2 text-base font-semibold
              leading-6 text-slate-700
            "
          >
            {unit}
          </p>
        ) : null}

        <p className="mt-4 text-base leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function LocationOverview({
  location,
  term,
}) {
  const termConfig = getTermConfig(
    location,
    term,
  );

  const apiTerm = location?.terms?.find(
    (availableTerm) =>
      availableTerm.code === term,
  );

  const cityName =
    location?.city?.name
    ?? location?.city
    ?? "Vilnius";

  const totalRooms =
    location?.total_rooms
    ?? location?.totalRooms
    ?? location?.roomsCount
    ?? "—";

  const startingRate =
    getStartingRate(location, term)
    ?? apiTerm?.starting_price
    ?? location?.starting_price
    ?? location?.startingPrice
    ?? null;

  const billingUnit =
    termConfig?.billingUnit
    ?? termConfig?.billing_unit
    ?? apiTerm?.billing_unit
    ?? "month";

  const description =
    location?.short_description
    ?? location?.shortDescription
    ?? location?.description
    ?? (
      "Comfortable accommodation in Vilnius with fully "
      + "furnished rooms and convenient access to public "
      + "transport and nearby facilities."
    );

  const features =
    Array.isArray(location?.features)
    && location.features.length > 0
      ? location.features
      : DEFAULT_FEATURES;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="
            grid items-start gap-12
            lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]
            lg:gap-16
          "
        >
          {/* Left content */}
          <div className="min-w-0">
            <p
              className="
                text-sm font-semibold uppercase
                tracking-[0.3em] text-primary
              "
            >
              About This Location
            </p>

            <h2
              className="
                mt-6 max-w-2xl text-4xl font-bold
                leading-tight tracking-tight text-slate-950
                sm:text-5xl lg:text-6xl
              "
            >
              Experience

              <span className="block">
                Comfortable Living
              </span>
            </h2>

            <p
              className="
                mt-8 max-w-2xl text-lg
                leading-8 text-slate-600
              "
            >
              {description}
            </p>

            <ul className="mt-10 space-y-5">
              {features.map((feature, index) => {
                const featureText =
                  typeof feature === "string"
                    ? feature
                    : feature?.title
                      ?? feature?.name
                      ?? feature?.label;

                if (!featureText) {
                  return null;
                }

                return (
                  <li
                    key={`${featureText}-${index}`}
                    className="
                      flex items-start gap-4
                      text-lg text-slate-700
                    "
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="
                        mt-0.5 size-6 shrink-0
                        text-emerald-500
                      "
                    />

                    <span className="leading-7">
                      {featureText}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right information cards */}
          <div
            className="
              grid min-w-0 grid-cols-1
              auto-rows-fr gap-6 sm:grid-cols-2
            "
          >
            <LocationStatCard
              icon={Building2}
              value={cityName}
              description="Accommodation location in Lithuania."
            />

            <LocationStatCard
              icon={BedDouble}
              value={totalRooms}
              description="Total physical rooms at this location."
            />

            <LocationStatCard
              icon={Euro}
              value={formatEuroAmount(startingRate)}
              unit={`Per person / ${billingUnit}`}
              description="Starting accommodation rate."
            />

            <LocationStatCard
              icon={MapPin}
              value={cityName}
              description="Convenient access to nearby facilities."
            />
          </div>
        </div>
      </div>
    </section>
  );
}