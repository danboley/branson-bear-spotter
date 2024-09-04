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
    latitude?: google.maps.LatLngLiteral; // Can be null, so it could be `number | null`
    longitude?: google.maps.LatLngLiteral; // Can be null, so it could be `number | null`
    approvalStatus: 'active' | 'denied' | 'pending';
    approvalNotes?: string;
    imagePath?: string;
    userId: string; // UUID
  }

  export interface Poi {
    id: string; // UUID
    name: string;
    address: string;
    details?: string;
    location?: google.maps.LatLngLiteral;
    approvalStatus: 'active' | 'denied' | 'pending';
    approvalNotes?: string;
    imagePath?: string;
    userId: string; // UUID
  }