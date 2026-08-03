import seskinesImage from "@/assets/Mikotel/DSC01665-HDR-Edit.jpg";
import pylimoImage from "@/assets/Mikotel/DSC01700-HDR-Edit.jpg";
import latgaliuImage from "@/assets/Mikotel/DSC01860-HDR-Edit.jpg";

import { STAY_TERMS } from "@/data/stayTerms";

const locations = [
  {
    id: 1,
    slug: "seskines",
    name: "Šeškinės",
    city: "Vilnius",

    image: seskinesImage,

    totalRooms: 13,

    description:
      "Comfortable long-term accommodation in Vilnius with fully furnished rooms and convenient access to public transport and nearby facilities.",

    amenities: [
      "High-Speed Wi-Fi",
      "Shared Kitchen",
      "Laundry",
      "Heating",
    ],

    featured: true,

    allowedTerms: [
      STAY_TERMS.LONG_TERM,
    ],

    defaultTerm: STAY_TERMS.LONG_TERM,

    termConfig: {
      [STAY_TERMS.LONG_TERM]: {
        billingUnit: "month",

        utilitiesIncluded: true,

        fixedPeriod: {
          startMonth: 9,
          startDay: 1,
          endMonth: 8,
          endDay: 31,
        },

        roomRates: {
          1: 160,
          2: 190,
          3: 170,
          4: 150,
        },
      },
    },
  },

  {
    id: 2,
    slug: "latgaliu",
    name: "Latgalių",
    city: "Vilnius",

    image: latgaliuImage,

    totalRooms: 9,

    description:
      "Affordable long-term accommodation in Vilnius offering furnished rooms, shared facilities and convenient access to the city.",

    amenities: [
      "Wi-Fi",
      "Laundry",
      "Kitchen",
      "Heating",
    ],

    featured: true,

    allowedTerms: [
      STAY_TERMS.LONG_TERM,
    ],

    defaultTerm: STAY_TERMS.LONG_TERM,

    termConfig: {
      [STAY_TERMS.LONG_TERM]: {
        billingUnit: "month",

        utilitiesIncluded: false,

        fixedPeriod: {
          startMonth: 9,
          startDay: 1,
          endMonth: 8,
          endDay: 31,
        },

        roomRates: {
          1: 220,
          2: 180,
          3: 160,
        },
      },
    },
  },

  {
    id: 3,
    slug: "pylimo",
    name: "Pylimo gatvė 63",
    city: "Vilnius",

    image: pylimoImage,

    totalRooms: 24,

    description:
      "Centrally located accommodation at Pylimo gatvė 63 offering both short-term and long-term accommodation options.",

    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Laundry",
      "Heating",
    ],

    featured: true,

    allowedTerms: [
      STAY_TERMS.SHORT_TERM,
      STAY_TERMS.LONG_TERM,
    ],

    defaultTerm: STAY_TERMS.LONG_TERM,

    termConfig: {
      [STAY_TERMS.SHORT_TERM]: {
        billingUnit: "night",

        utilitiesIncluded: null,

        minNights: 1,

        maxMonths: 3,

        allowedFloors: [
          3,
          4,
        ],

        roomRates: {
          1: 25,
          2: 20,
          3: 15,
        },
      },

      [STAY_TERMS.LONG_TERM]: {
        billingUnit: "month",

        utilitiesIncluded: false,

        fixedPeriod: {
          startMonth: 9,
          startDay: 1,
          endMonth: 8,
          endDay: 31,
        },

        roomRates: {
          1: 299,
          2: 199,
          3: 179,
        },
      },
    },
  },
];

export default locations;