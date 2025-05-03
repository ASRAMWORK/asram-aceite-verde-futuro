
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useIsMobile';

export const mobileStyle = (baseStyles: string, mobileStyles: string) => {
  return twMerge(baseStyles, `md:${baseStyles} ${mobileStyles} md:!${baseStyles}`);
};

// Mobile-first utility functions
export const mobilePadding = () => "p-3 md:p-6";
export const mobileMargin = () => "m-2 md:m-4";
export const mobileTextSize = () => "text-sm md:text-base";
export const mobileHeadingSize = () => "text-xl md:text-2xl";
export const mobileTouchTarget = () => "min-h-[44px] min-w-[44px]"; // Ensure minimum touch target size
export const mobileTableTextSize = () => "text-xs md:text-base";
export const mobileTablePadding = () => "px-2 py-2 md:p-4";
export const mobileStackedItem = () => "flex flex-col md:flex-row md:items-center md:space-x-4";
export const mobileFullWidth = () => "w-full md:w-auto";
export const mobileSpacing = () => "space-y-3 md:space-y-6";
export const mobileButtonSize = () => "text-xs md:text-sm py-2 px-3 md:py-2 md:px-4";
export const mobileFontSize = (desktop: string) => `text-[0.9rem] md:text-[${desktop}]`;
export const mobileSectionPadding = () => "px-3 py-4 md:p-6";
export const mobileCardPadding = () => "p-3 md:p-5";
export const mobileGap = () => "gap-3 md:gap-4";
export const mobileFlexCol = () => "flex flex-col md:flex-row";
export const mobileScrollArea = () => "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent";
export const mobileCardMinHeight = () => "min-h-[12rem] md:min-height-0";
export const mobileCompactLayout = () => "grid-cols-1 md:grid-cols-3";

// Enhanced mobile grid layouts
export const mobileGrid = (cols: number) => `grid grid-cols-1 md:grid-cols-${cols} ${mobileGap()}`;
export const mobileCompactGrid = () => "grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4";
export const mobileFullGrid = () => "grid grid-cols-1 w-full overflow-x-hidden";

// Preset color schemes for mobile-specific theming
export const mobilePrimaryColor = "#ee970d";
export const mobileAccentColor = "#ffefd1"; 
export const mobileBackgroundColor = "#ffffff";
export const mobileHeaderBg = "bg-white dark:bg-gray-900";
export const mobileCardBg = "bg-white dark:bg-gray-800";
export const mobileTextColor = "text-gray-800 dark:text-gray-200";

// Hook that returns all mobile styles at once
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
    sectionPadding: mobileSectionPadding(),
    cardPadding: mobileCardPadding(),
    gap: mobileGap(),
    flexCol: mobileFlexCol(),
    scrollArea: mobileScrollArea(),
    compactGrid: mobileCompactGrid(),
    fullGrid: mobileFullGrid(),
    cardMinHeight: mobileCardMinHeight(),
    compactLayout: mobileCompactLayout(),
    colors: {
      primary: mobilePrimaryColor,
      accent: mobileAccentColor,
      background: mobileBackgroundColor,
      headerBg: mobileHeaderBg,
      cardBg: mobileCardBg,
      text: mobileTextColor
    }
  };
};
