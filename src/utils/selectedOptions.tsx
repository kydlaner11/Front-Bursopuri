import { SelectedOption } from '../types';

export const isSameSelected = (
  a: { name: string; price: number }[],
  b: { name: string; price: number }[]
) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name));
  const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name));
  return sortedA.every(
    (item, idx) =>
      item.name === sortedB[idx].name && item.price === sortedB[idx].price,
  );
};

export const isSameOptions = (a?: SelectedOption[], b?: SelectedOption[]) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  return a.every((optA) => {
    const optB = b.find((bItem) => bItem.name === optA.name);
    return optB ? isSameSelected(optA.selected, optB.selected) : false;
  });
};

export const getSelectedOptionsPrice = (selectedOptions?: SelectedOption[]) => {
  return (
    selectedOptions?.reduce((sum, opt) => {
      return sum + opt.selected.reduce((s, item) => s + item.price, 0);
    }, 0) || 0
  );
};