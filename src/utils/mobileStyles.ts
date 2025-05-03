
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useIsMobile';

export const mobileStyle = (baseStyles: string, mobileStyles: string) => {
  return twMerge(baseStyles, `md:${baseStyles} ${mobileStyles} md:!${baseStyles}`);
};

export const mobilePadding = () => "p-3 md:p-6";
export const mobileMargin = () => "m-2 md:m-4";
export const mobileTextSize = () => "text-sm md:text-base";
export const mobileHeadingSize = () => "text-xl md:text-2xl";
export const mobileTouchTarget = () => "min-h-[44px] min-w-[44px]";
export const mobileTableTextSize = () => "text-xs md:text-base";
export const mobileTablePadding = () => "px-2 py-2 md:p-4";
export const mobileStackedItem = () => "flex flex-col md:flex-row md:items-center md:space-x-4";
export const mobileFullWidth = () => "w-full md:w-auto";
export const mobileSpacing = () => "space-y-3 md:space-y-6";
export const mobileButtonSize = () => "text-xs md:text-sm py-2 px-3 md:py-2 md:px-4";
export const mobileFontSize = (desktop: string) => `text-[0.9rem] md:text-[${desktop}]`;

export const useMobileStyles = () => {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    padding: mobilePadding(),
    margin: mobileMargin(),
    textSize: mobileTextSize(),
    headingSize: mobileHeadingSize(),
    touchTarget: mobileTouchTarget(),
    tableTextSize: mobileTableTextSize(),
    tablePadding: mobileTablePadding(),
    stackedItem: mobileStackedItem(),
    fullWidth: mobileFullWidth(),
    spacing: mobileSpacing(),
    buttonSize: mobileButtonSize(),
  };
};
