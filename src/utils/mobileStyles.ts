
import { twMerge } from 'tailwind-merge';

export const mobileStyle = (baseStyles: string, mobileStyles: string) => {
  return twMerge(baseStyles, `md:${baseStyles} ${mobileStyles} md:!${baseStyles}`);
};

export const mobilePadding = () => "p-3 md:p-6";
export const mobileMargin = () => "m-2 md:m-4";
export const mobileTextSize = () => "text-sm md:text-base";
export const mobileHeadingSize = () => "text-xl md:text-2xl";
export const mobileTouchTarget = () => "min-h-[44px] min-w-[44px]";
