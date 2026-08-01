import oneBed from "../assets/Mikotel/1.jpeg";
import twoBed from "../assets/Mikotel/2.jpeg";
import threeBed from "../assets/Mikotel/3.jpeg";
import fourBed from "../assets/Mikotel/4.jpeg";

const roomTypes = [
  {
    id: 1,
    slug: "1-bed-room",
    title: "Private Room",
    subtitle: "1 Bed",
    image: oneBed,

    beds: 1,
    capacity: 1,

    price: "€250/month",

    available: 6,

    size: "18 m²",

    description:
      "A private fully furnished room ideal for students and professionals seeking privacy and comfort.",

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
    title: "Twin Room",
    subtitle: "2 Beds",
    image: twoBed,

    beds: 2,
    capacity: 2,

    price: "€320/month",

    available: 8,

    size: "24 m²",

    description:
      "Comfortable twin room with modern furniture and shared facilities.",

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
    title: "Triple Room",
    subtitle: "3 Beds",
    image: threeBed,

    beds: 3,
    capacity: 3,

    price: "€190/month",

    available: 5,

    size: "30 m²",

    description:
      "Affordable room perfect for students who prefer shared accommodation.",

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
    title: "Shared Room",
    subtitle: "4 Beds",
    image: fourBed,

    beds: 4,
    capacity: 4,

    price: "€160/month",

    available: 10,

    size: "36 m²",

    description:
      "Budget-friendly shared room with all essential facilities included.",

    amenities: [
      "Wi-Fi",
      "Laundry",
      "Kitchen",
      "Heating",
    ],
  },
];

export default roomTypes;