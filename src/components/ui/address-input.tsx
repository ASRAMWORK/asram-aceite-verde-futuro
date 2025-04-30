
import * as React from "react";
import { cn } from "@/lib/utils";
import { initAddressAutocomplete, AddressComponent } from "@/lib/googleMaps";

interface AddressInputProps extends React.ComponentProps<"input"> {
  onAddressSelected?: (addressData: AddressComponent) => void;
}

const AddressInput = React.forwardRef<HTMLInputElement, AddressInputProps>(
  ({ className, onAddressSelected, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = React.useMemo(
      () => {
        return (node: HTMLInputElement) => {
          // Apply both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          inputRef.current = node;
        };
      },
      [ref]
    );

    React.useEffect(() => {
      if (inputRef.current && onAddressSelected) {
        initAddressAutocomplete(inputRef.current, onAddressSelected);
      }
    }, [onAddressSelected]);

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={mergedRef}
        {...props}
      />
    );
  }
);

AddressInput.displayName = "AddressInput";

export { AddressInput };
