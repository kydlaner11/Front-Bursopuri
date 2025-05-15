export function handleOptionSelect(
  prev: { [key: string]: { name: string; price: number }[] },
  category: string,
  choice: { name: string; price: number },
  options: {
    [key: string]: {
      max: number;
      choices: { name: string; price: number }[];
    };
  }
): { [key: string]: { name: string; price: number }[] } {
  const current = prev[category] || [];

  if (current.some((item) => item.name === choice.name)) {
    return {
      ...prev,
      [category]: current.filter((item) => item.name !== choice.name),
    };
  }

  if (current.length >= options[category].max) {
    return prev; // Cannot add more than the maximum limit
  }

  return {
    ...prev,
    [category]: [...current, choice],
  };
}
