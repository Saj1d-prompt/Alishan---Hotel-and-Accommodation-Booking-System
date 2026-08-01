import image1 from "../assets/Mikotel/DSC01665-HDR-Edit.jpg";
import image2 from "../assets/Mikotel/DSC01700-HDR-Edit.jpg";
import image3 from "../assets/Mikotel/DSC01860-HDR-Edit.jpg";

const locations = [
  {
    id: 1,
    slug: "seskines",
    name: "Šeškinės",
    city: "Vilnius",

    image: image1,

    price: "From €250/month",

    rooms: 42,

    description:
      "A modern accommodation offering comfortable, fully furnished rooms with excellent transport connections and nearby universities.",

    amenities: [
      "High-Speed Wi-Fi",
      "Shared Kitchen",
      "Laundry",
      "Heating",
    ],

    featured: true,
  },

  {
    id: 2,
    slug: "pylimo",
    name: "Pylimo",
    city: "Vilnius",

    image: image2,

    price: "From €320/month",

    rooms: 31,

    description:
      "Located in the heart of Vilnius, perfect for students and professionals looking for convenience and comfort.",

    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Parking",
      "Security",
    ],

    featured: true,
  },

  {
    id: 3,
    slug: "latgaliu",
    name: "Latgalių",
    city: "Vilnius",

    image: image3,

    price: "From €280/month",

    rooms: 38,

    description:
      "Affordable accommodation with spacious common areas, modern facilities and a peaceful environment.",

    amenities: [
      "Wi-Fi",
      "Laundry",
      "Kitchen",
      "Heating",
    ],

    featured: true,
  },
];

export default locations;