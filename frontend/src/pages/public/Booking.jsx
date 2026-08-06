import {
  differenceInCalendarDays,
  format,
  parseISO,
} from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Upload,
  Users,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import locations from "@/data/locations";
import roomTypes from "@/data/roomTypes";
import {
  getRoomRate,
  getTermConfig,
  getTermLabel,
  getUtilitiesLabel,
  isTermAllowed,
} from "@/lib/accommodation";
import {
  submitBookingRequest,
} from "@/services/bookingApi";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

function getNextLongTermPeriod() {
  const today = new Date();

  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  let startYear =
    today.getFullYear();

  let startDate =
    new Date(
      startYear,
      8,
      1,
    );

  if (
    todayAtMidnight > startDate
  ) {
    startYear += 1;

    startDate =
      new Date(
        startYear,
        8,
        1,
      );
  }

  const endDate =
    new Date(
      startYear + 1,
      7,
      31,
    );

  return {
    startDate,
    endDate,
  };
}

function FieldError({
  message,
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

const Booking = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const location = locations.find(
    (item) =>
      item.slug ===
      searchParams.get("location"),
  );

  const room = roomTypes.find(
    (item) =>
      item.slug ===
      searchParams.get(
        "room_type",
      ),
  );

  const requestedTerm =
    searchParams.get("term");

  const term =
    location
      && isTermAllowed(
        location,
        requestedTerm,
      )
      ? requestedTerm
      : null;

  const requestedOccupants =
    Number(
      searchParams.get(
        "occupants",
      ),
    );

  const occupants =
    Number.isInteger(
      requestedOccupants,
    )
      && requestedOccupants > 0
      ? requestedOccupants
      : 1;

  const rate =
    location && room && term
      ? getRoomRate(
        location,
        term,
        room.capacity,
      )
      : null;

  const startDate =
    searchParams.get(
      "start_date",
    );

  const endDate =
    searchParams.get(
      "end_date",
    );

  const shortTermDatesAreValid =
    term !== "short_term"
    || Boolean(
      startDate && endDate,
    );

  const contextIsValid =
    Boolean(location)
    && Boolean(room)
    && Boolean(term)
    && rate !== null
    && occupants <= room.capacity
    && shortTermDatesAreValid;

  const {
    register,
    handleSubmit,
    setError,
    control,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      passport_number: "",
      notes: "",
      privacy_accepted: false,
    },
  });

  const passportFiles = useWatch({
    control,
    name: "passport_copy",
  });

  const selectedPassportFile =
    passportFiles?.[0] ?? null;

  if (!contextIsValid) {
    return (
      <main className="min-h-[75vh] bg-slate-50 px-6 pb-20 pt-36">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto size-12 text-amber-500" />

          <h1 className="mt-5 text-4xl font-bold text-slate-950">
            Select Accommodation First
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            A booking request requires a
            valid location, accommodation
            term, room type, occupant count
            and short-term dates when
            applicable.
          </p>

          <Link
            to="/locations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Choose Accommodation
          </Link>
        </div>
      </main>
    );
  }

  const config =
    getTermConfig(
      location,
      term,
    );

  const utilitiesLabel =
    getUtilitiesLabel(
      config.utilitiesIncluded,
    );

  const longTermPeriod =
    getNextLongTermPeriod();

  const durationUnits =
    term === "short_term"
      ? differenceInCalendarDays(
        parseISO(endDate),
        parseISO(startDate),
      )
      : 12;

  const estimatedTotal =
    rate
    * occupants
    * durationUnits;

  const stayPeriodLabel =
    term === "short_term"
      ? `${format(
        parseISO(startDate),
        "dd MMM yyyy",
      )} – ${format(
        parseISO(endDate),
        "dd MMM yyyy",
      )}`
      : `${format(
        longTermPeriod.startDate,
        "dd MMM yyyy",
      )} – ${format(
        longTermPeriod.endDate,
        "dd MMM yyyy",
      )}`;

  const onSubmit = async (
    formValues,
  ) => {
    const passportFile =
      formValues
        .passport_copy?.[0];

    const formData =
      new FormData();

    formData.append(
      "property_slug",
      location.slug,
    );

    formData.append(
      "room_type_slug",
      room.slug,
    );

    formData.append(
      "term",
      term,
    );

    formData.append(
      "occupants",
      String(occupants),
    );

    formData.append(
      "first_name",
      formValues.first_name,
    );

    formData.append(
      "last_name",
      formValues.last_name,
    );

    formData.append(
      "email",
      formValues.email,
    );

    formData.append(
      "phone",
      formValues.phone,
    );

    formData.append(
      "passport_number",
      formValues.passport_number,
    );

    formData.append(
      "passport_copy",
      passportFile,
    );

    formData.append(
      "privacy_accepted",
      formValues
        .privacy_accepted
        ? "1"
        : "0",
    );

    if (
      formValues.notes?.trim()
    ) {
      formData.append(
        "notes",
        formValues
          .notes
          .trim(),
      );
    }

    if (
      term === "short_term"
    ) {
      formData.append(
        "check_in_date",
        startDate,
      );

      formData.append(
        "check_out_date",
        endDate,
      );
    }

    try {
      const result =
        await submitBookingRequest(
          formData,
        );

      const bookingReference =
        result
          .booking
          .booking_reference;

      const accessToken =
        result.access_token;

      navigate(
        `/booking/status/${encodeURIComponent(
          bookingReference,
        )}?token=${encodeURIComponent(
          accessToken,
        )}`,
        {
          replace: true,
        },
      );
    } catch (error) {
      const validationErrors =
        error
          .response
          ?.data
          ?.errors;

      if (validationErrors) {
        Object
          .entries(
            validationErrors,
          )
          .forEach(
            ([
              fieldName,
              messages,
            ]) => {
              setError(
                fieldName,
                {
                  type: "server",

                  message:
                    Array.isArray(
                      messages,
                    )
                      ? messages[0]
                      : String(
                        messages,
                      ),
                },
              );
            },
          );

        return;
      }

      setError(
        "root",
        {
          type: "server",

          message:
            error
              .response
              ?.data
              ?.message
            ?? "The booking request could not be submitted. Please try again.",
        },
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Booking Request
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">
            Applicant Information
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Enter the primary applicant&apos;s
            details and attach a clear
            passport scan. No payment is
            collected before Admin reviews
            the request.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit(
              onSubmit,
            )
          }
          className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_390px]"
          encType="multipart/form-data"
        >
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-center gap-3">
                <Users className="size-6 text-blue-600" />

                <h2 className="text-2xl font-bold text-slate-950">
                  Primary Applicant
                </h2>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first_name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    First name
                  </label>

                  <Input
                    id="first_name"
                    autoComplete="given-name"
                    className="mt-2 h-12"
                    {...register(
                      "first_name",
                      {
                        required:
                          "First name is required.",

                        minLength: {
                          value: 2,

                          message:
                            "First name must contain at least 2 characters.",
                        },
                      },
                    )}
                  />

                  <FieldError
                    message={
                      errors
                        .first_name
                        ?.message
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Last name
                  </label>

                  <Input
                    id="last_name"
                    autoComplete="family-name"
                    className="mt-2 h-12"
                    {...register(
                      "last_name",
                      {
                        required:
                          "Last name is required.",

                        minLength: {
                          value: 2,

                          message:
                            "Last name must contain at least 2 characters.",
                        },
                      },
                    )}
                  />

                  <FieldError
                    message={
                      errors
                        .last_name
                        ?.message
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3 top-3.5 size-5 text-slate-400" />

                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="h-12 pl-11"
                      {...register(
                        "email",
                        {
                          required:
                            "Email address is required.",

                          pattern: {
                            value:
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                            message:
                              "Enter a valid email address.",
                          },
                        },
                      )}
                    />
                  </div>

                  <FieldError
                    message={
                      errors.email?.message
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone number
                  </label>

                  <div className="relative mt-2">
                    <Phone className="pointer-events-none absolute left-3 top-3.5 size-5 text-slate-400" />

                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+370 ..."
                      className="h-12 pl-11"
                      {...register(
                        "phone",
                        {
                          required:
                            "Phone number is required.",

                          minLength: {
                            value: 7,

                            message:
                              "Enter a valid phone number.",
                          },
                        },
                      )}
                    />
                  </div>

                  <FieldError
                    message={
                      errors.phone?.message
                    }
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-center gap-3">
                <FileText className="size-6 text-blue-600" />

                <h2 className="text-2xl font-bold text-slate-950">
                  Passport Proof
                </h2>
              </div>

              <p className="mt-3 leading-7 text-slate-600">
                The passport number is
                encrypted, and the uploaded
                file is stored in private
                backend storage for
                authenticated Admin review.
              </p>

              <div className="mt-8">
                <label
                  htmlFor="passport_number"
                  className="text-sm font-semibold text-slate-700"
                >
                  Passport number
                </label>

                <Input
                  id="passport_number"
                  autoComplete="off"
                  className="mt-2 h-12 uppercase"
                  {...register(
                    "passport_number",
                    {
                      required:
                        "Passport number is required.",

                      minLength: {
                        value: 4,

                        message:
                          "Enter a valid passport number.",
                      },
                    },
                  )}
                />

                <FieldError
                  message={
                    errors
                      .passport_number
                      ?.message
                  }
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="passport_copy"
                  className="text-sm font-semibold text-slate-700"
                >
                  Passport scanned copy
                </label>

                <label
                  htmlFor="passport_copy"
                  className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <Upload className="size-9 text-blue-600" />

                  <span className="mt-4 font-semibold text-slate-900">
                    Choose PDF, JPG or PNG
                  </span>

                  <span className="mt-2 text-sm text-slate-500">
                    Maximum file size: 10 MB
                  </span>
                </label>

                <Input
                  id="passport_copy"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="sr-only"
                  {...register(
                    "passport_copy",
                    {
                      required:
                        "A scanned passport copy is required.",

                      validate: {
                        size:
                          (files) =>
                            !files?.[0]
                            || files[0]
                              .size
                            <= MAX_FILE_SIZE
                            || "The passport copy must not exceed 10 MB.",

                        type:
                          (files) =>
                            !files?.[0]
                            || ALLOWED_FILE_TYPES
                              .includes(
                                files[0]
                                  .type,
                              )
                            || "Upload a PDF, JPG or PNG file.",
                      },
                    },
                  )}
                />

                {selectedPassportFile ? (
                  <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    Selected:{" "}
                    {
                      selectedPassportFile
                        .name
                    }
                  </p>
                ) : null}

                <FieldError
                  message={
                    errors
                      .passport_copy
                      ?.message
                  }
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <label
                htmlFor="notes"
                className="text-sm font-semibold text-slate-700"
              >
                Additional notes (optional)
              </label>

              <textarea
                id="notes"
                rows={5}
                placeholder="Add information that may help Admin review the request."
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register(
                  "notes",
                  {
                    maxLength: {
                      value: 2000,

                      message:
                        "Notes must not exceed 2000 characters.",
                    },
                  },
                )}
              />

              <FieldError
                message={
                  errors.notes?.message
                }
              />

              <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-5">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  {...register(
                    "privacy_accepted",
                    {
                      required:
                        "You must accept the declaration before submitting.",
                    },
                  )}
                />

                <span className="text-sm leading-6 text-slate-700">
                  I confirm that the
                  information and passport
                  proof are accurate. I
                  consent to MB Ethos 24
                  processing this information
                  for accommodation booking
                  review and administration.
                </span>
              </label>

              <FieldError
                message={
                  errors
                    .privacy_accepted
                    ?.message
                }
              />

              {errors.root ? (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <AlertCircle className="mt-0.5 size-5 shrink-0" />

                  <p className="text-sm font-medium">
                    {errors.root.message}
                  </p>
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 h-14 w-full rounded-xl text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-5" />
                    Submit Booking Request
                  </>
                )}
              </Button>

              <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-500">
                <Lock className="mt-0.5 size-4 shrink-0" />

                <p>
                  No payment is collected now.
                  Admin must review the
                  application and passport
                  proof first.
                </p>
              </div>
            </section>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Booking Summary
            </p>

            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              {room.title}
            </h2>

            <div className="mt-7 space-y-5 border-y border-slate-200 py-7">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="font-semibold text-slate-900">
                    {location.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">
                    {getTermLabel(term)}{" "}
                    period
                  </p>

                  <p className="font-semibold leading-6 text-slate-900">
                    {stayPeriodLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 size-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">
                    Occupants
                  </p>

                  <p className="font-semibold text-slate-900">
                    {occupants}{" "}
                    {occupants === 1
                      ? "person"
                      : "people"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm text-slate-500">
                Rate
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-950">
                €{rate}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Per person /{" "}
                {config.billingUnit}
              </p>

              {utilitiesLabel ? (
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  {utilitiesLabel}
                </p>
              ) : null}
            </div>

            <div className="mt-7 rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-700">
                Estimated{" "}
                {term === "short_term"
                  ? "stay"
                  : "contract"}{" "}
                total
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-950">
                €
                {estimatedTotal.toFixed(
                  2,
                )}
              </p>

              <p className="mt-2 text-xs leading-5 text-blue-700">
                This is an estimate, not the
                amount charged now. Admin will
                set the payable amount after
                approval.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Booking;