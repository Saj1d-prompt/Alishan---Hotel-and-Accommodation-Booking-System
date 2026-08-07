import seskinesImage1 from "@/assets/Mikotel/Seskines Pictures/20.jpeg";
import seskinesImage2 from "@/assets/Mikotel/Seskines Pictures/24.jpeg";
import seskinesImage3 from "@/assets/Mikotel/Seskines Pictures/25.jpeg";
import seskinesImage4 from "@/assets/Mikotel/Seskines Pictures/27.jpeg";
import seskinesImage5 from "@/assets/Mikotel/Seskines Pictures/21.jpeg";

import latgaliuImage1 from "@/assets/Mikotel/Latgaliu Pictures/7.jpeg";
import latgaliuImage2 from "@/assets/Mikotel/Latgaliu Pictures/1.jpeg";
import latgaliuImage3 from "@/assets/Mikotel/Latgaliu Pictures/3.jpeg";
import latgaliuImage4 from "@/assets/Mikotel/Latgaliu Pictures/5.jpeg";
import latgaliuImage5 from "@/assets/Mikotel/Latgaliu Pictures/9.jpeg";

import pylimoImage1 from "@/assets/Mikotel/DSC01860-HDR-Edit.jpg";
import pylimoImage2 from "@/assets/Mikotel/DSC01805-Edit.jpg";
import pylimoImage3 from "@/assets/Mikotel/DSC01770-HDR-Edit.jpg";
import pylimoImage4 from "@/assets/Mikotel/DSC01940-HDR-Edit.jpg";
import pylimoImage5 from "@/assets/Mikotel/DSC01670-HDR.jpg";

import {
  STAY_TERMS,
} from "@/data/stayTerms";

const locations = [
  {
    id: 1,

    slug: "seskines",

    name: "Šeškinės",

    city: "Vilnius",

    /*
     * Main location image.
     *
     * Used for location cards, hero fallbacks,
     * and anywhere that needs one representative image.
     */
    image:
      seskinesImage1,

    /*
     * Location gallery.
     *
     * Add additional Šeškinės images here later.
     */
    gallery: [
      seskinesImage1,
      seskinesImage2,
      seskinesImage3,
      seskinesImage4,
      seskinesImage5,
    ],

    totalRooms: 14,

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

    defaultTerm:
      STAY_TERMS.LONG_TERM,

    termConfig: {
      [STAY_TERMS.LONG_TERM]: {
        billingUnit:
          "month",

        utilitiesIncluded:
          true,

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

    image:
      latgaliuImage1,

    /*
     * Add additional Latgalių property/gallery
     * images here.
     *
     * Room-type images remain separate in
     * roomTypes.js.
     */
    gallery: [
      latgaliuImage1,
      latgaliuImage2,
      latgaliuImage3,
      latgaliuImage4,
      latgaliuImage5,
    ],

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

    defaultTerm:
      STAY_TERMS.LONG_TERM,

    termConfig: {
      [STAY_TERMS.LONG_TERM]: {
        billingUnit:
          "month",

        utilitiesIncluded:
          false,

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

    image:
      pylimoImage1,

    /*
     * Pylimo location gallery.
     *
     * This is the gallery shown on:
     *
     * /locations/pylimo
     *
     * Add additional Pylimo property photos here.
     */
    gallery: [
      pylimoImage1,
      pylimoImage2,
      pylimoImage3,
      pylimoImage4,
      pylimoImage5,
    ],

    totalRooms: 25,

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

    defaultTerm:
      STAY_TERMS.LONG_TERM,

    termConfig: {
      [STAY_TERMS.SHORT_TERM]: {
        billingUnit:
          "night",

        utilitiesIncluded:
          null,

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
        billingUnit:
          "month",

        utilitiesIncluded:
          false,

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