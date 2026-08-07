import latgaliuOneBed from "@/assets/Mikotel/Latgaliu Pictures/7.jpeg";
import latgaliuTwoBed from "@/assets/Mikotel/Latgaliu Pictures/8.jpeg";
import latgaliuThreeBed from "@/assets/Mikotel/Latgaliu Pictures/8.jpeg";

import seskinesOneBed from "@/assets/Mikotel/Seskines Pictures/14.jpeg";
import seskinesTwoBed from "@/assets/Mikotel/Seskines Pictures/17.jpeg";
import seskinesThreeBed from "@/assets/Mikotel/Seskines Pictures/14.jpeg";
import seskinesFourBed from "@/assets/Mikotel/Seskines Pictures/15.jpeg";

import pylimoOneBed from "@/assets/Mikotel/DSC01755-HDR-Edit.jpg";
import pylimoTwoBed from "@/assets/Mikotel/DSC01835-HDR-Edit-2.jpg";
import pylimoThreeBed from "@/assets/Mikotel/DSC01650-HDR.jpg";

const roomTypes = [
  {
    id: 1,

    slug: "1-bed-room",

    title: "1 Bed Room",

    subtitle: "1 Person",

    beds: 1,

    capacity: 1,

    description:
      "A fully furnished 1 bed room designed for guests who prefer a private accommodation option.",

    amenities: [
      "Wi-Fi",
      "Study Desk",
      "Wardrobe",
      "Heating",
    ],

    locations: {
      seskines: {
        image: seskinesOneBed,

        gallery: [
          seskinesOneBed,
        ],

        size: null,
      },

      latgaliu: {
        image: latgaliuOneBed,

        gallery: [
          latgaliuOneBed,
        ],

        size: null,
      },

      pylimo: {
        image: pylimoOneBed,

        gallery: [
          pylimoOneBed,
        ],

        size: null,
      },
    },
  },

  {
    id: 2,

    slug: "2-bed-room",

    title: "2 Bed Room",

    subtitle: "2 Persons",

    beds: 2,

    capacity: 2,

    description:
      "A comfortable fully furnished 2 bed room suitable for two occupants.",

    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Heating",
      "Wardrobe",
    ],

    locations: {
      seskines: {
        image: seskinesTwoBed,

        gallery: [
          seskinesTwoBed,
        ],

        size: null,
      },

      latgaliu: {
        image: latgaliuTwoBed,

        gallery: [
          latgaliuTwoBed,
        ],

        size: null,
      },

      pylimo: {
        image: pylimoTwoBed,

        gallery: [
          pylimoTwoBed,
        ],

        size: null,
      },
    },
  },

  {
    id: 3,

    slug: "3-bed-room",

    title: "3 Bed Room",

    subtitle: "3 Persons",

    beds: 3,

    capacity: 3,

    description:
      "A spacious 3 bed accommodation option designed for comfortable shared living.",

    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Laundry",
      "Heating",
    ],

    locations: {
      seskines: {
        image: seskinesThreeBed,

        gallery: [
          seskinesThreeBed,
        ],

        size: null,
      },

      latgaliu: {
        image: latgaliuThreeBed,

        gallery: [
          latgaliuThreeBed,
        ],

        size: null,
      },

      pylimo: {
        image: pylimoThreeBed,

        gallery: [
          pylimoThreeBed,
        ],

        size: null,
      },
    },
  },

  {
    id: 4,

    slug: "4-bed-room",

    title: "4 Bed Room",

    subtitle: "4 Persons",

    beds: 4,

    capacity: 4,

    description:
      "A practical 4 bed accommodation option offering essential facilities for shared living.",

    amenities: [
      "Wi-Fi",
      "Laundry",
      "Kitchen",
      "Heating",
    ],

    locations: {
      seskines: {
        image: seskinesFourBed,

        gallery: [
          seskinesFourBed,
        ],

        size: null,
      },
    },
  },
];

export default roomTypes;