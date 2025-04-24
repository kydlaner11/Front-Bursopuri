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
  dietaryPreferences?: string[];
};
