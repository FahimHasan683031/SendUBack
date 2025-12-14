export interface IZone {
  id: number; // Auto-increment
  name: string;
  countries: string[]; // ISO 2-letter country codes
  isActive?: boolean;
}