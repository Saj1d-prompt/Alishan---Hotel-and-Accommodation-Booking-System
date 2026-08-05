import {
  useMemo,
  useState,
} from "react";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  Clock3,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import locations from "@/data/locations";

import {
  STAY_TERMS,
  STAY_TERM_LABELS,
} from "@/data/stayTerms";

const SearchCard = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState();
  const [property, setProperty] = useState("");
  const [term, setTerm] = useState("");
  const [guests, setGuests] = useState("1");
  const [error, setError] = useState("");

  const selectedLocation = useMemo(
    () =>
      locations.find(
        (location) =>
          location.slug === property
      ) ?? null,
    [property]
  );

  const handlePropertyChange = (value) => {
    const location = locations.find(
      (item) => item.slug === value
    );

    setProperty(value);
    setTerm(location?.defaultTerm ?? "");
    setDate(undefined);
    setError("");
  };

  const handleTermChange = (value) => {
    setTerm(value);

    if (value === STAY_TERMS.LONG_TERM) {
      setDate(undefined);
    }

    setError("");
  };

  const handleSearch = () => {
    if (!selectedLocation) {
      setError(
        "Please select an accommodation location."
      );

      return;
    }

    if (!term) {
      setError(
        "Please select an accommodation term."
      );

      return;
    }

    if (
      term === STAY_TERMS.SHORT_TERM &&
      (!date?.from || !date?.to)
    ) {
      setError(
        "Please select both short-term arrival and departure dates."
      );

      return;
    }

    const params = new URLSearchParams();

    params.set("term", term);
    params.set("occupants", guests);

    if (
      term === STAY_TERMS.SHORT_TERM &&
      date?.from &&
      date?.to
    ) {
      params.set(
        "start_date",
        format(date.from, "yyyy-MM-dd")
      );

      params.set(
        "end_date",
        format(date.to, "yyyy-MM-dd")
      );
    }

    navigate(
      `/locations/${selectedLocation.slug}` +
        `?${params.toString()}#room-types`
    );
  };

  const dateLabel = (() => {
    if (!selectedLocation) {
      return "Select property first";
    }

    if (term === STAY_TERMS.LONG_TERM) {
      return "1 September – 31 August";
    }

    if (date?.from && date?.to) {
      return (
        `${format(
          date.from,
          "dd MMM yyyy"
        )}` +
        ` – ${format(
          date.to,
          "dd MMM yyyy"
        )}`
      );
    }

    if (date?.from) {
      return format(
        date.from,
        "dd MMM yyyy"
      );
    }

    return "Select dates";
  })();

  return (
    <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr_1.45fr_0.9fr_auto]">
        <div className="flex min-h-24 items-center border-b px-6 lg:border-b-0 lg:border-r">
          <Building2 className="mr-4 h-6 w-6 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Property
            </span>

            <Select
              value={property}
              onValueChange={
                handlePropertyChange
              }
            >
              <SelectTrigger className="mt-1 h-auto border-0 p-0 shadow-none">
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>

              <SelectContent>
                {locations.map((location) => (
                  <SelectItem
                    key={location.slug}
                    value={location.slug}
                  >
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex min-h-24 items-center border-b px-6 lg:border-b-0 lg:border-r">
          <Clock3 className="mr-4 h-6 w-6 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Term
            </span>

            <Select
              value={term}
              onValueChange={
                handleTermChange
              }
              disabled={!selectedLocation}
            >
              <SelectTrigger className="mt-1 h-auto border-0 p-0 shadow-none">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>

              <SelectContent>
                {selectedLocation?.allowedTerms.map(
                  (availableTerm) => (
                    <SelectItem
                      key={availableTerm}
                      value={availableTerm}
                    >
                      {
                        STAY_TERM_LABELS[
                          availableTerm
                        ]
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex min-h-24 items-center border-b px-6 lg:border-b-0 lg:border-r">
          <CalendarDays className="mr-4 h-6 w-6 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Stay
            </span>

            {term === STAY_TERMS.SHORT_TERM ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mt-1 block max-w-full truncate text-left text-base font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {dateLabel}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={date}
                    onSelect={setDate}
                    disabled={{
                      before: new Date(),
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <p className="mt-1 text-base font-semibold text-gray-900">
                {dateLabel}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-h-24 items-center border-b px-6 lg:border-b-0 lg:border-r">
          <Users className="mr-4 h-6 w-6 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Occupants
            </span>

            <Select
              value={guests}
              onValueChange={setGuests}
            >
              <SelectTrigger className="mt-1 h-auto border-0 p-0 shadow-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">
                  1 Person
                </SelectItem>

                <SelectItem value="2">
                  2 People
                </SelectItem>

                <SelectItem value="3">
                  3 People
                </SelectItem>

                <SelectItem value="4">
                  4 People
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-center p-5">
          <Button
            type="button"
            onClick={handleSearch}
            className="h-14 w-full min-w-40 rounded-xl text-base font-semibold"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Rooms
          </Button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default SearchCard;