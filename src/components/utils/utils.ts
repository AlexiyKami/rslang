export const createElement = (
  tag: string,
  className?: string,
  dataAttrName?: string,
  dataAttrValue?: string,
  textContent?: string
): HTMLElement => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (dataAttrValue && dataAttrName) element.dataset[dataAttrName] = dataAttrValue;
  if (textContent) element.textContent = textContent;

  return element;
};

export const getElement = (tagClass: string): HTMLElement | null => document.querySelector(`.${tagClass}`);

export const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);
