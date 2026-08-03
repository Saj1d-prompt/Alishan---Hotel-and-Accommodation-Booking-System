import oneBed from "@/assets/Mikotel/1.jpeg";
import twoBed from "@/assets/Mikotel/2.jpeg";
import threeBed from "@/assets/Mikotel/3.jpeg";
import fourBed from "@/assets/Mikotel/4.jpeg";

const roomTypes = [
  {
    id: 1,
    slug: "1-bed-room",
    title: "1 Bed Room",
    subtitle: "1 Person",
    image: oneBed,

    beds: 1,
    capacity: 1,

    size: "18 m²",

    description:
      "A fully furnished 1 bed room designed for guests who prefer a private accommodation option.",

    amenities: [
      "Wi-Fi",
      "Study Desk",
      "Wardrobe",
      "Heating",
    ],
  },

  {
    id: 2,
    slug: "2-bed-room",
    title: "2 Bed Room",
    subtitle: "2 Persons",
    image: twoBed,

    beds: 2,
    capacity: 2,

    size: "24 m²",

    description:
      "A comfortable fully furnished 2 bed room suitable for two occupants.",

    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Heating",
      "Wardrobe",
    ],
  },

  {
    id: 3,
    slug: "3-bed-room",
    title: "3 Bed Room",
    subtitle: "3 Persons",
    image: threeBed,

    beds: 3,
    capacity: 3,

    size: "30 m²",

    description:
      "A spacious 3 bed accommodation option designed for comfortable shared living.",

    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Laundry",
      "Heating",
    ],
  },

  {
    id: 4,
    slug: "4-bed-room",
    title: "4 Bed Room",
    subtitle: "4 Persons",
    image: fourBed,

    beds: 4,
    capacity: 4,

    size: "36 m²",

    description:
      "A practical 4 bed accommodation option offering essential facilities for shared living.",

    amenities: [
      "Wi-Fi",
      "Laundry",
      "Kitchen",
      "Heating",
    ],
  },
];

export default roomTypes;