import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "alishan@ethos24lt.com",
    href: "mailto:alishan@ethos24lt.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+370 69400005",
    href: "tel:+37069400005",
  },
  {
    icon: ExternalLink,
    label: "Company Website",
    value: "ethos24lt.com",
    href: "https://ethos24lt.com/",
    external: true,
  },
];

const Contact = () => {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-20">
      <section className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
            Contact
          </span>

          <h1 className="mt-5 text-5xl font-bold sm:text-6xl">
            Speak With Alishan Accommodation
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-50">
            Contact the team for questions about
            locations, room types, booking requests
            or an existing accommodation application.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-950">
            Contact Details
          </h2>

          <div className="mt-8 space-y-5">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={
                    item.external
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    item.external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <Icon className="mt-1 size-6 shrink-0 text-blue-600" />

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-1 font-semibold text-slate-950">
                      {item.value}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <MapPin className="size-10 text-blue-600" />

          <h2 className="mt-6 text-3xl font-bold text-slate-950">
            Company Address
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            MB Ethos 24
            <br />
            Žirmūnų g. 57
            <br />
            Vilnius, 09110
            <br />
            Lithuania
          </p>

          <p className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            This is the company address. Exact
            accommodation-property addresses should
            be displayed only after the client has
            confirmed them.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Contact;