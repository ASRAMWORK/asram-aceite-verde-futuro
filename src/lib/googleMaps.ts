
import { toast } from "sonner";

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyB83Eo2HTUAXuInJZANTQ9p4CC2Ia9UV0o';

// Interface for address components
export interface AddressComponent {
  ciudad?: string;
  provincia?: string;
  pais?: string;
  codigoPostal?: string;
  distrito?: string;
  barrio?: string;
  direccionCompleta?: string;
  latitud?: number;
  longitud?: number;
}

// Load the Google Maps JavaScript API
export const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Google Maps API loaded");
      resolve();
    };
    
    script.onerror = (error) => {
      console.error("Error loading Google Maps API:", error);
      reject(new Error("Error cargando Google Maps API"));
    };
    
    document.head.appendChild(script);
  });
};

// Geocode an address to get lat/lng and address components
export const geocodeAddress = async (address: string): Promise<AddressComponent | null> => {
  try {
    await loadGoogleMapsApi();
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status !== 'OK' || !results || results.length === 0) {
          console.error("Geocode error:", status);
          reject(new Error(`Error al geocodificar dirección: ${status}`));
          return;
        }
        
        const result = results[0];
        const addressComponents = result.address_components;
        const location = result.geometry.location;
        
        const addressData: AddressComponent = {
          direccionCompleta: result.formatted_address,
          latitud: location.lat(),
          longitud: location.lng(),
        };
        
        // Extract address components
        addressComponents.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality')) {
            addressData.ciudad = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            addressData.provincia = component.long_name;
          } else if (types.includes('country')) {
            addressData.pais = component.long_name;
          } else if (types.includes('postal_code')) {
            addressData.codigoPostal = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            addressData.distrito = component.long_name;
          } else if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
            addressData.barrio = component.long_name;
          }
        });
        
        resolve(addressData);
      });
    });
  } catch (error) {
    console.error("Error in geocodeAddress:", error);
    toast.error("Error al geolocalizar la dirección");
    return null;
  }
};

// Autocomplete for address inputs
export const initAddressAutocomplete = (
  inputElement: HTMLInputElement, 
  onPlaceSelected: (addressData: AddressComponent) => void
): void => {
  if (!inputElement) return;
  
  loadGoogleMapsApi()
    .then(() => {
      const autocomplete = new google.maps.places.Autocomplete(inputElement, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry'],
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
          toast.error("No se encontraron detalles para esta dirección");
          return;
        }
        
        const addressData: AddressComponent = {
          direccionCompleta: place.formatted_address,
          latitud: place.geometry.location.lat(),
          longitud: place.geometry.location.lng(),
        };
        
        place.address_components?.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality')) {
            addressData.ciudad = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            addressData.provincia = component.long_name;
          } else if (types.includes('country')) {
            addressData.pais = component.long_name;
          } else if (types.includes('postal_code')) {
            addressData.codigoPostal = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            addressData.distrito = component.long_name;
          } else if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
            addressData.barrio = component.long_name;
          }
        });
        
        onPlaceSelected(addressData);
      });
    })
    .catch(error => {
      console.error("Error initializing autocomplete:", error);
    });
};
