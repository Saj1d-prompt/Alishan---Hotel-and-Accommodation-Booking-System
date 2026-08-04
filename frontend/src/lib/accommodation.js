import { STAY_TERM_LABELS } from "@/data/stayTerms";

export const isTermAllowed = (
  location,
  term
) => {
  return (
    location?.allowedTerms?.includes(term)
    ?? false
  );
};

export const getTermConfig = (
  location,
  term
) => {
  if (!location || !term) {
    return null;
  }

  return (
    location.termConfig?.[term]
    ?? null
  );
};

export const getRoomRate = (
  location,
  term,
  capacity
) => {
  const config = getTermConfig(
    location,
    term
  );

  if (!config) {
    return null;
  }

  const rate =
    config.roomRates?.[capacity];

  return typeof rate === "number"
    ? rate
    : null;
};

export const getStartingRate = (
  location,
  term
) => {
  const config = getTermConfig(
    location,
    term
  );

  if (!config) {
    return null;
  }

  const rates = Object.values(
    config.roomRates ?? {}
  ).filter(
    (rate) =>
      typeof rate === "number"
  );

  if (rates.length === 0) {
    return null;
  }

  return Math.min(...rates);
};

export const formatRate = (
  amount,
  billingUnit
) => {
  if (
    amount === null
    || amount === undefined
  ) {
    return "Price unavailable";
  }

  return `€${amount}/person/${billingUnit}`;
};

export const getTermLabel = (
  term
) => {
  return (
    STAY_TERM_LABELS[term]
    ?? term
  );
};

export const getUtilitiesLabel = (
  utilitiesIncluded
) => {
  if (utilitiesIncluded === true) {
    return "Utilities included";
  }

  if (utilitiesIncluded === false) {
    return "Utilities excluded";
  }

  return null;
};