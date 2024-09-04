export interface User {
  id: string; // UUID
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  profilePicture?: string;
  location?: string;
}

export interface Poi {
  id: string; // UUID
  name: string;
  address: string;
  details?: string;
  latitude?: number;
  longitude?: number;
  approvalStatus: "active" | "denied" | "pending";
  approvalNotes?: string;
  imagePath?: string;
  userId: string; // UUID
  location: google.maps.LatLngLiteral;
  User: User;
}
