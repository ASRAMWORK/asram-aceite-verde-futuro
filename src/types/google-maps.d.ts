
// Type definitions for Google Maps JavaScript API
declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        getZoom(): number;
        getCenter(): LatLng;
        setOptions(options: MapOptions): void;
        panTo(latLng: LatLng | LatLngLiteral): void;
        panBy(x: number, y: number): void;
        fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
        getBounds(): LatLngBounds;
        getDiv(): Element;
        getHeading(): number;
        setHeading(heading: number): void;
        setTilt(tilt: number): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
        data: Data;
      }

      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
        toString(): string;
        toJSON(): LatLngLiteral;
        equals(other: LatLng): boolean;
        toUrlValue(precision?: number): string;
      }

      class LatLngBounds {
        constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
        contains(latLng: LatLng | LatLngLiteral): boolean;
        equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
        extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
        getCenter(): LatLng;
        getNorthEast(): LatLng;
        getSouthWest(): LatLng;
        intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
        isEmpty(): boolean;
        toJSON(): LatLngBoundsLiteral;
        toSpan(): LatLng;
        toString(): string;
        toUrlValue(precision?: number): string;
        union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        setPosition(latLng: LatLng | LatLngLiteral): void;
        setTitle(title: string): void;
        setLabel(label: string | MarkerLabel): void;
        setIcon(icon: string | Icon | Symbol): void;
        getPosition(): LatLng;
        getTitle(): string;
        getLabel(): MarkerLabel;
        getIcon(): string | Icon | Symbol;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map?: Map, anchor?: MVCObject): void;
        close(): void;
        getContent(): string | Element;
        getPosition(): LatLng;
        setContent(content: string | Element): void;
        setPosition(position: LatLng | LatLngLiteral): void;
        setOptions(options: InfoWindowOptions): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class Geocoder {
        constructor();
        geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
      }

      class NavigationControl {
        constructor(opts?: NavigationControlOptions);
      }

      class MVCObject {
        addListener(eventName: string, handler: Function): MapsEventListener;
        bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
        changed(key: string): void;
        get(key: string): any;
        notify(key: string): void;
        set(key: string, value: any): void;
        setValues(values: any): void;
        unbind(key: string): void;
        unbindAll(): void;
      }

      class Data extends MVCObject {
        constructor(options?: Data.DataOptions);
        add(feature: Data.Feature | Data.FeatureOptions): Data.Feature;
        addGeoJson(geoJson: Object, options?: Data.GeoJsonOptions): Array<Data.Feature>;
        contains(feature: Data.Feature): boolean;
        forEach(callback: (feature: Data.Feature) => void): void;
        getFeatureById(id: number | string): Data.Feature;
        remove(feature: Data.Feature): void;
        setControls(controls: Array<string>): void;
        setControlOptions(options: Data.ControlOptions): void;
        setDrawingMode(drawingMode: string | null): void;
        setStyle(style: Data.StylingFunction | Data.StyleOptions): void;
        toGeoJson(callback: (feature: Object) => void): void;
      }

      interface MapsEventListener {
        remove(): void;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        disableDefaultUI?: boolean;
        disableDoubleClickZoom?: boolean;
        draggable?: boolean;
        mapTypeId?: string;
        maxZoom?: number;
        minZoom?: number;
        scrollwheel?: boolean;
        streetViewControl?: boolean;
        zoomControl?: boolean;
        styles?: Array<MapTypeStyle>;
        mapTypeControl?: boolean;
        fullscreenControl?: boolean;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface LatLngBoundsLiteral {
        east: number;
        north: number;
        south: number;
        west: number;
      }

      interface Padding {
        bottom: number;
        left: number;
        right: number;
        top: number;
      }

      interface MarkerOptions {
        position: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        label?: string | MarkerLabel;
        icon?: string | Icon | Symbol;
        draggable?: boolean;
        clickable?: boolean;
        animation?: number;
      }

      interface MarkerLabel {
        color?: string;
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: string;
        text: string;
      }

      interface Icon {
        url: string;
        anchor?: Point;
        labelOrigin?: Point;
        origin?: Point;
        scaledSize?: Size;
        size?: Size;
      }

      interface Symbol {
        path: string | SymbolPath;
        anchor?: Point;
        fillColor?: string;
        fillOpacity?: number;
        labelOrigin?: Point;
        rotation?: number;
        scale?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
      }

      interface InfoWindowOptions {
        content?: string | Element;
        position?: LatLng | LatLngLiteral;
        maxWidth?: number;
        disableAutoPan?: boolean;
        pixelOffset?: Size;
      }

      interface GeocoderRequest {
        address?: string;
        location?: LatLng | LatLngLiteral;
        placeId?: string;
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: GeocoderComponentRestrictions;
        region?: string;
      }

      interface GeocoderComponentRestrictions {
        country?: string | string[];
      }

      enum GeocoderStatus {
        ERROR = "ERROR",
        INVALID_REQUEST = "INVALID_REQUEST",
        OK = "OK",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
        ZERO_RESULTS = "ZERO_RESULTS"
      }

      interface GeocoderResult {
        address_components: GeocoderAddressComponent[];
        formatted_address: string;
        geometry: {
          location: LatLng;
          location_type: GeocoderLocationType;
          viewport: LatLngBounds;
          bounds?: LatLngBounds;
        };
        partial_match: boolean;
        place_id: string;
        postcode_localities?: string[];
        types: string[];
      }

      interface GeocoderAddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      enum GeocoderLocationType {
        APPROXIMATE = "APPROXIMATE",
        GEOMETRIC_CENTER = "GEOMETRIC_CENTER",
        RANGE_INTERPOLATED = "RANGE_INTERPOLATED",
        ROOFTOP = "ROOFTOP"
      }

      interface NavigationControlOptions {
        position?: ControlPosition;
        style?: MapTypeControlStyle;
      }

      enum ControlPosition {
        BOTTOM = 11,
        BOTTOM_CENTER = 11,
        BOTTOM_LEFT = 10,
        BOTTOM_RIGHT = 12,
        LEFT_BOTTOM = 6,
        LEFT_CENTER = 4,
        LEFT_TOP = 5,
        RIGHT_BOTTOM = 9,
        RIGHT_CENTER = 8,
        RIGHT_TOP = 7,
        TOP = 2,
        TOP_CENTER = 2,
        TOP_LEFT = 1,
        TOP_RIGHT = 3
      }

      enum MapTypeControlStyle {
        DEFAULT = 0,
        DROPDOWN_MENU = 2,
        HORIZONTAL_BAR = 1
      }

      enum SymbolPath {
        BACKWARD_CLOSED_ARROW = 3,
        BACKWARD_OPEN_ARROW = 4,
        CIRCLE = 0,
        FORWARD_CLOSED_ARROW = 1,
        FORWARD_OPEN_ARROW = 2
      }

      interface MapTypeStyle {
        elementType?: string;
        featureType?: string;
        stylers: Array<MapTypeStyler>;
      }

      interface MapTypeStyler {
        [key: string]: string | number | null;
      }

      class Point {
        constructor(x: number, y: number);
        x: number;
        y: number;
        equals(other: Point): boolean;
        toString(): string;
      }

      class Size {
        constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
        width: number;
        height: number;
        equals(other: Size): boolean;
        toString(): string;
      }
      
      namespace places {
        class Autocomplete {
          constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
          addListener(eventName: string, handler: Function): MapsEventListener;
          getPlace(): PlaceResult;
          setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
          setComponentRestrictions(restrictions: ComponentRestrictions): void;
          setTypes(types: string[]): void;
        }
        
        interface AutocompleteOptions {
          bounds?: LatLngBounds | LatLngBoundsLiteral;
          componentRestrictions?: ComponentRestrictions;
          placeIdOnly?: boolean;
          strictBounds?: boolean;
          types?: string[];
          fields?: string[];
        }
        
        interface ComponentRestrictions {
          country: string | string[];
        }
        
        interface PlaceResult {
          address_components?: GeocoderAddressComponent[];
          adr_address?: string;
          formatted_address?: string;
          formatted_phone_number?: string;
          geometry?: {
            location: LatLng;
            viewport: LatLngBounds;
          };
          name?: string;
          photos?: PlacePhoto[];
          place_id?: string;
          price_level?: number;
          rating?: number;
          types?: string[];
          url?: string;
          utc_offset?: number;
          vicinity?: string;
          website?: string;
        }
        
        interface PlacePhoto {
          getUrl(opts: PhotoOptions): string;
          height: number;
          html_attributions: string[];
          width: number;
        }
        
        interface PhotoOptions {
          maxHeight?: number;
          maxWidth?: number;
        }
      }
      
      // Add any other interfaces as needed for your application
    }
  }
}

export {};
