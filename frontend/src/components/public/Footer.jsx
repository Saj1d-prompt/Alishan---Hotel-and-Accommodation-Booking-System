import {
  ArrowUp,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative mt-24 bg-slate-950 text-slate-300">

      {/* Top Gradient */}

      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}

          <div>

            <h2 className="text-3xl font-bold tracking-wide text-white">
              ALISHAN
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Comfortable, secure and affordable accommodation
              designed for students, professionals and families
              across Lithuania.
            </p>

            <div className="mt-8 flex gap-4">

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-600 hover:text-white"
              >
                <FaLinkedinIn />
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-6 text-xl font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">

              <li>
                <a href="/" className="transition hover:text-blue-400">
                  Home
                </a>
              </li>

              <li>
                <a href="#locations" className="transition hover:text-blue-400">
                  Locations
                </a>
              </li>

              <li>
                <a href="#why-us" className="transition hover:text-blue-400">
                  Why Choose Us
                </a>
              </li>

              <li>
                <a href="#experience" className="transition hover:text-blue-400">
                  Experience
                </a>
              </li>

            </ul>

          </div>

          {/* Locations */}

          <div>

            <h3 className="mb-6 text-xl font-semibold text-white">
              Our Locations
            </h3>

            <ul className="space-y-4">

              <li>Šeškinės</li>

              <li>Pylimo</li>

              <li>Latgalių</li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-blue-400" />
                <span>
                  Vilnius,
                  <br />
                  Lithuania
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+370 XXX XXX XXX</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>info@alishan.lt</span>
              </div>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="my-10 border-t border-slate-800" />

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">

          <p className="text-center text-sm text-slate-500 lg:text-left">
            © {new Date().getFullYear()} Alishan Accommodation.
            All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm">

            <a href="#" className="transition hover:text-blue-400">
              Privacy Policy
            </a>

            <a href="#" className="transition hover:text-blue-400">
              Terms & Conditions
            </a>

          </div>

          <button
            onClick={scrollToTop}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
          >
            <ArrowUp size={18} />
          </button>

        </div>

      </div>

    </footer>
  );
};

export default Footer;