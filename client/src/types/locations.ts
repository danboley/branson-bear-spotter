export type Poi = {
  key: string;
  name: string;
  location: google.maps.LatLngLiteral;
};

export const locations: Poi[] = [
  {
    key: "musicHallOfWilliamsburg",
    name: "Music Hall of Williamsburg",
    location: { lat: 40.71915168066542, lng: -73.96174765855504 },
  },
  {
    key: "thirstyPig",
    name: "The Thirsty Pig",
    location: { lat: 43.65733061114076, lng: -70.2537999126202 },
  },
  {
    key: "lonePineBrewing",
    name: "Lone Pine Brewing",
    location: { lat: 43.67001882133092, lng: -70.25586520680675 },
  },
  {
    key: "felinaRidgewood",
    name: "Felina Ridgewood",
    location: { lat: 40.979258079901776, lng: -74.11931609411646 },
  },
  {
    key: "brouwerijLane",
    name: "Brouwerij Lane",
    location: { lat: 40.729626986952866, lng: -73.95791165389261 },
  },
  {
    key: "chancerySquareApartments",
    name: "Chancery Square Apartments",
    location: { lat: 40.79888683015648, lng: -74.48264839198595 },
  },
];
