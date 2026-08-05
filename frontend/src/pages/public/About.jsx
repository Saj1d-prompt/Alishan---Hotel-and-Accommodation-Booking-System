import {
  Building2,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Building2,
    title: "Practical Accommodation",
    description:
      "Furnished room options for short-term and long-term stays in Vilnius.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed Booking Process",
    description:
      "Booking requests are reviewed before a room is assigned and payment is requested.",
  },
  {
    icon: MapPin,
    title: "Vilnius Locations",
    description:
      "Accommodation options are currently available across three Vilnius locations.",
  },
];

const About = () => {
  return (
    <main className="bg-slate-50 pb-24 pt-20">
      <section className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
            About Alishan
          </span>

          <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-tight sm:text-6xl">
            Accommodation Designed for Comfortable
            Living
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-blue-50">
            Alishan Accommodation offers furnished
            short-term and long-term accommodation in
            Vilnius. The service is operated by MB
            Ethos 24.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <h2 className="text-4xl font-bold text-slate-950">
              A Clear Booking Process
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Customers choose a location,
              accommodation term and room type before
              submitting a booking request. The
              request is reviewed by Admin before a
              physical room is assigned.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Rates are displayed per person.",
                "Short-term accommodation is available only at Pylimo gatvė 63.",
                "Long-term accommodation follows the 1 September to 31 August period.",
                "Payment is requested only after approval.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-500" />

                  <p className="leading-7 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Company Details
            </p>

            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              MB Ethos 24
            </h3>

            <dl className="mt-6 space-y-4 text-slate-600">
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Company code
                </dt>

                <dd className="mt-1 font-semibold text-slate-900">
                  306713846
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Registered address
                </dt>

                <dd className="mt-1 leading-7 text-slate-900">
                  Žirmūnų g. 57, Vilnius, 09110
                  Vilniaus m. sav., Lithuania
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Icon className="size-9 text-blue-600" />

                <h3 className="mt-6 text-2xl font-bold text-slate-950">
                  {value.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/locations"
            className="inline-flex rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Locations
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;