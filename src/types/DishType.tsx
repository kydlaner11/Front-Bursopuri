export type SelectedOption = {
  name: string; // misal: 'Pilihan Sambal'
  selected: { name: string; price: number }[]; // misal: ['Sambal Terasi', 'Sambal Matah']
};

export type OptionChoice = {
  name: string;
  price: number;
};

export type DishOption = {
  max: number;
  optional: boolean;
  choices: OptionChoice[];
};

export type DishType = {
  id: string;
  name: string;
  kcal: string;
  image: string;
  price: string;
  weight: string;
  isNew?: boolean;
  isHot?: boolean;
  menu: string[];
  quantity?: number;
  notes?: string;
  description: string;
  isRecommended?: boolean;
  tersedia?: boolean;
  stock?: number; // Optional, if stock is not always provided
  dietaryPreferences?: string[];
  selectedOptions?: SelectedOption[]; // <- ini bagian penting
  option?: Record<string, DishOption>; // Add this to store the options from the response
};
