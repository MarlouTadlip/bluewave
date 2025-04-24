// User types
export type UserRole = "ADMIN" | "ORGANIZER" | "VOLUNTEER";

export interface User {
  userId: number;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  joinDate: Date;
}

// Event types
export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Event {
  eventId: number;
  title: string;
  description: string;
  organizerId: number;
  locationId: number;
  eventDate: Date;
  capacity: number;
  status: EventStatus;
}

// Location types
export interface Location {
  locationId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

// Participation types
export interface Participation {
  participationId: number;
  userId: number;
  eventId: number;
  checkInTime?: Date;
  checkOutTime?: Date;
  volunteerHours: number;
}

// Cleanup data types
export interface CleanupData {
  cleanupId: number;
  eventId: number;
  totalWeight: number;
  totalBags: number;
  submittedBy: number;
  submissionDate: Date;
}

// Trash category types
export interface TrashCategory {
  categoryId: number;
  name: string;
  description: string;
  colorHex: string;
}

// Sponsor types
export interface Sponsor {
  sponsorId: number;
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
}

// Event sponsor types
export interface EventSponsor {
  eventId: number;
  sponsorId: number;
  amount: number;
}

export interface UserSession {
  id: string;
  role: UserRole;
}

export interface Cookies {
  set: (name: string, value: string, options: unknown) => void;
  get: (name: string) => string;
  remove: (name: string) => void;
}
