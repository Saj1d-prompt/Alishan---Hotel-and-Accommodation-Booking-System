import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand / Company */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white">
              Alishan Accommodation
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              Comfortable short-term and long-term accommodation
              solutions in Vilnius, Lithuania.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Building2
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="font-medium text-white">
                    Operated by MB Ethos 24
                  </p>

                  <p className="text-slate-400">
                    Company code: 306713846
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <p className="text-slate-400">
                  Žirmūnų g. 57, Vilnius, 09110 Vilniaus m. sav.,
                  Lithuania
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <nav className="mt-5 space-y-3">
              <Link
                to="/"
                className="block transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/locations"
                className="block transition hover:text-white"
              >
                Locations
              </Link>

              <Link
                to="/rooms"
                className="block transition hover:text-white"
              >
                Rooms
              </Link>

              <Link
                to="/about"
                className="block transition hover:text-white"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="block transition hover:text-white"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:alishan@ethos24lt.com"
                className="flex items-start gap-3 transition hover:text-white"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <span className="break-all">
                  alishan@ethos24lt.com
                </span>
              </a>

              <a
                href="tel:+37069400005"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Phone
                  size={18}
                  className="shrink-0 text-blue-400"
                />

                <span>
                  +370 69400005
                </span>
              </a>

              <a
                href="https://ethos24lt.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <ExternalLink
                  size={18}
                  className="shrink-0 text-blue-400"
                />

                <span>
                  MB Ethos 24 Website
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-800 pt-8">
          <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              © {currentYear} Alishan Accommodation. All rights reserved.
            </p>

            <p>
              Operated by MB Ethos 24 · Company code 306713846
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;