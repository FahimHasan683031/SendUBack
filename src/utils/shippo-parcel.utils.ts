// src/modules/shippo/shippo-parcel.utils.ts

export interface ParcelInput {
  length: number;
  width: number;
  height: number;
  distance_unit: "in";
  weight: number;
  mass_unit: "lb";
}

const PARCEL_PRESETS: Record<string, ParcelInput> = {
  // ------- DOCUMENTS -------
  "Documents": { length: 12, width: 9, height: 1, distance_unit: "in", weight: 0.5, mass_unit: "lb" },
  "ID Card": { length: 6, width: 4, height: 1, distance_unit: "in", weight: 0.2, mass_unit: "lb" },
  "Drivers Licence": { length: 6, width: 4, height: 1, distance_unit: "in", weight: 0.2, mass_unit: "lb" },
  "Professional Card": { length: 6, width: 4, height: 1, distance_unit: "in", weight: 0.2, mass_unit: "lb" },
  "Credit Cards": { length: 6, width: 4, height: 1, distance_unit: "in", weight: 0.2, mass_unit: "lb" },
  "Purse": { length: 10, width: 6, height: 3, distance_unit: "in", weight: 1, mass_unit: "lb" },

  // ------- ELECTRONICS -------
  "Laptop": { length: 15, width: 11, height: 3, distance_unit: "in", weight: 4, mass_unit: "lb" },
  "Smartphone": { length: 7, width: 4, height: 2, distance_unit: "in", weight: 1, mass_unit: "lb" },
  "Tablet": { length: 10, width: 7, height: 2, distance_unit: "in", weight: 1.5, mass_unit: "lb" },
  "e-reader": { length: 8, width: 5, height: 2, distance_unit: "in", weight: 1, mass_unit: "lb" },
  "Headphones & Airpods": { length: 8, width: 6, height: 4, distance_unit: "in", weight: 1, mass_unit: "lb" },
  "Smartwatch": { length: 6, width: 6, height: 3, distance_unit: "in", weight: 0.5, mass_unit: "lb" },
  "Camera": { length: 10, width: 7, height: 6, distance_unit: "in", weight: 2, mass_unit: "lb" },
  "Game Console": { length: 15, width: 10, height: 5, distance_unit: "in", weight: 6, mass_unit: "lb" },
  "Charger": { length: 5, width: 5, height: 3, distance_unit: "in", weight: 0.3, mass_unit: "lb" },

  // ------- CLOTHES -------
  "Trousers": { length: 12, width: 10, height: 2, distance_unit: "in", weight: 1, mass_unit: "lb" },
  "Shorts": { length: 10, width: 8, height: 2, distance_unit: "in", weight: 0.8, mass_unit: "lb" },
  "Blouse": { length: 12, width: 10, height: 2, distance_unit: "in", weight: 0.8, mass_unit: "lb" },
  "Shirt": { length: 12, width: 10, height: 2, distance_unit: "in", weight: 0.8, mass_unit: "lb" },
  "Skirt": { length: 12, width: 10, height: 2, distance_unit: "in", weight: 0.7, mass_unit: "lb" },
  "Jacket": { length: 16, width: 14, height: 5, distance_unit: "in", weight: 2, mass_unit: "lb" },
  "Swimsuit": { length: 10, width: 8, height: 2, distance_unit: "in", weight: 0.5, mass_unit: "lb" },
  "Sweatshirt - Hoodie": { length: 14, width: 12, height: 4, distance_unit: "in", weight: 1.5, mass_unit: "lb" },
  "Shoes": { length: 14, width: 10, height: 6, distance_unit: "in", weight: 3, mass_unit: "lb" },
  "Belt": { length: 10, width: 4, height: 2, distance_unit: "in", weight: 0.4, mass_unit: "lb" },
  "Hat": { length: 12, width: 10, height: 6, distance_unit: "in", weight: 0.5, mass_unit: "lb" },

  // ------- ACCESSORIES -------
  "Keys": { length: 6, width: 4, height: 1, distance_unit: "in", weight: 0.3, mass_unit: "lb" },
  "Glasses": { length: 7, width: 3, height: 3, distance_unit: "in", weight: 0.5, mass_unit: "lb" },
  "Perfume": { length: 6, width: 4, height: 3, distance_unit: "in", weight: 0.7, mass_unit: "lb" },

  // ------- JEWELLERY -------
  "Watch": { length: 6, width: 6, height: 2, distance_unit: "in", weight: 0.4, mass_unit: "lb" },
  "Ring": { length: 4, width: 4, height: 2, distance_unit: "in", weight: 0.2, mass_unit: "lb" },
  "Earring": { length: 4, width: 4, height: 2, distance_unit: "in", weight: 0.2, mass_unit: "lb" },
  "Bracelet": { length: 5, width: 5, height: 2, distance_unit: "in", weight: 0.3, mass_unit: "lb" },
  "Necklace": { length: 6, width: 6, height: 2, distance_unit: "in", weight: 0.3, mass_unit: "lb" },

  // ------- BAGS -------
  "Backpack": { length: 18, width: 14, height: 6, distance_unit: "in", weight: 2, mass_unit: "lb" },
  "Small cabin bag": { length: 22, width: 14, height: 8, distance_unit: "in", weight: 6, mass_unit: "lb" },
  "Large suitcase": { length: 28, width: 20, height: 10, distance_unit: "in", weight: 15, mass_unit: "lb" },
  "Purse, Pencil case": { length: 10, width: 6, height: 3, distance_unit: "in", weight: 1, mass_unit: "lb" },
  "Handbag": { length: 14, width: 10, height: 5, distance_unit: "in", weight: 1.2, mass_unit: "lb" },
  "Shopping bag": { length: 12, width: 8, height: 4, distance_unit: "in", weight: 0.8, mass_unit: "lb" },
  "Fanny pack": { length: 8, width: 5, height: 3, distance_unit: "in", weight: 0.7, mass_unit: "lb" },

  // ------- SPORTS ITEMS -------
  "Surf": { length: 70, width: 20, height: 6, distance_unit: "in", weight: 12, mass_unit: "lb" },
  "Kite": { length: 30, width: 8, height: 6, distance_unit: "in", weight: 6, mass_unit: "lb" },
  "Ski": { length: 72, width: 6, height: 6, distance_unit: "in", weight: 10, mass_unit: "lb" },
  "Golf bag": { length: 48, width: 12, height: 12, distance_unit: "in", weight: 20, mass_unit: "lb" },
  "Tennis": { length: 28, width: 12, height: 6, distance_unit: "in", weight: 5, mass_unit: "lb" },
  "Bicycle": { length: 54, width: 8, height: 30, distance_unit: "in", weight: 35, mass_unit: "lb" },
  "Other Sport Gear": { length: 20, width: 12, height: 8, distance_unit: "in", weight: 10, mass_unit: "lb" },

  // ------- OTHER -------
  "Other": { length: 10, width: 10, height: 5, distance_unit: "in", weight: 2, mass_unit: "lb" },
};



export const generateParcel = (productType: string): ParcelInput => {
  return (
    PARCEL_PRESETS[productType] ||
    PARCEL_PRESETS["Other"] 
  );
};
