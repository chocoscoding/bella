export const restaurant = {
  name: "Bella Cucina of the Lake",
  phone: "(540) 388-4430",
  phoneHref: "tel:+15403884430",
  address: "4444 Germanna Highway",
  locality: "Locust Grove, VA 22508",
  city: "Locust Grove",
  region: "VA",
  postalCode: "22508",
  orderUrl: "/order",
  cateringUrl: "/catering",
  /** Full menu: the online ordering page, fed live from Clover. */
  officialMenuUrl: "/order",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=4444%20Germanna%20Highway%2C%20Locust%20Grove%2C%20VA%2022508",
  // Manually verified on Google Maps on October 21, 2026; not a live feed.
  googleRating: {
    score: 4.3,
    count: 355,
    checkedOn: "2026-10-21",
    url: "https://www.google.com/maps/place/?q=place_id:ChIJkRhaEj-9tokRKG4rjRR2IzE",
  },
  facebookUrl: "https://www.facebook.com/Bellacofthelake/",
  hours: [
    ["Monday – Saturday", "8:00 am – 10:00 pm"],
    ["Sunday", "8:00 am – 9:00 pm"],
  ],
  /** Machine-readable copy of `hours`, used for structured data. Keep the two in step. */
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "22:00" },
    { days: ["Sunday"], opens: "08:00", closes: "21:00" },
  ],
};
export const featured = [
  {
    name: "Spaghetti",
    price: 14.75,
    image: "spaghetti",
    category: "Pasta",
    description:
      "A familiar favorite with your choice of meatballs, sausage, or mushrooms.",
  },
  {
    name: "Baked Ziti",
    price: 14.75,
    image: "ziti",
    category: "From the oven",
    description: "Penne, ricotta, and mozzarella baked with tomato sauce.",
  },
  {
    name: "Linguini Alia Pescatore",
    price: 21.75,
    image: "seafood",
    category: "Seafood",
    description:
      "Linguini with shrimp, calamari, mussels, and clams in marinara.",
  },
  {
    name: "Shrimp Scampi",
    price: 18.25,
    image: "scampi",
    category: "Seafood",
    description: "Angel hair with shrimp, garlic, olive oil, and white wine.",
  },
];
export const gallery = [
  { image: "spaghetti", title: "Spaghetti & meatballs", category: "Pasta" },
  { image: "pizza", title: "Pepperoni pizza", category: "Pizza" },
  { image: "seafood", title: "Seafood linguini", category: "Pasta" },
  { image: "ziti", title: "Baked ziti", category: "Pasta" },
  { image: "chicken", title: "Chicken & pasta", category: "Italian favorites" },
  {
    image: "piccata",
    title: "A little taste of Italy",
    category: "Italian favorites",
  },
  { image: "scampi", title: "Shrimp scampi", category: "Pasta" },
  {
    image: "dessert",
    title: "Save room for something sweet",
    category: "Dessert",
  },
];
