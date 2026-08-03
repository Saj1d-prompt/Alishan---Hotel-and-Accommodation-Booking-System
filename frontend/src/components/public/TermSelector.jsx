import {
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import {
  STAY_TERMS,
  STAY_TERM_LABELS,
} from "@/data/stayTerms";

import {
  getTermConfig,
  getUtilitiesLabel,
} from "@/lib/accommodation";

const TermSelector = ({
  location,
  selectedTerm,
  onTermChange,
}) => {
  const termConfig = getTermConfig(
    location,
    selectedTerm
  );

  const hasMultipleTerms =
    location.allowedTerms.length > 1;

  const utilitiesLabel =
    getUtilitiesLabel(
      termConfig?.utilitiesIncluded
    );

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm lg:p-10">

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">

            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                Accommodation Term
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Choose your accommodation type
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                The available booking terms depend on
                the selected Alishan accommodation
                location.
              </p>
            </div>

            <div>
              {hasMultipleTerms ? (
                <>
                  <label
                    htmlFor="stay-term"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Booking Term
                  </label>

                  <select
                    id="stay-term"
                    value={selectedTerm}
                    onChange={(event) =>
                      onTermChange(
                        event.target.value
                      )
                    }
                    className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {location.allowedTerms.map(
                      (term) => (
                        <option
                          key={term}
                          value={term}
                        >
                          {
                            STAY_TERM_LABELS[
                              term
                            ]
                          }
                        </option>
                      )
                    )}
                  </select>
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
                  <CheckCircle2
                    size={22}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Available Term
                    </p>

                    <p className="font-bold text-slate-900">
                      {
                        STAY_TERM_LABELS[
                          selectedTerm
                        ]
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">

            {selectedTerm ===
            STAY_TERMS.SHORT_TERM ? (
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={22}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    Short-term accommodation
                  </p>

                  <p className="mt-1 text-slate-600">
                    Minimum stay 1 night and
                    maximum stay 3 months.
                    Short-term accommodation at
                    Pylimo gatvė 63 is available
                    only on the 3rd and 4th floors.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={22}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    Long-term accommodation
                  </p>

                  <p className="mt-1 text-slate-600">
                    Long-term accommodation period:
                    1 September to 31 August.
                  </p>
                </div>
              </div>
            )}

            {utilitiesLabel && (
              <p className="mt-4 text-sm font-medium text-slate-600">
                {utilitiesLabel}
              </p>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default TermSelector;