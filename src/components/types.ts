export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export interface Room {
    dimensions: {
        width: number;
        length: number;
        height: number;
    };
    windows: number;
    features: string[];
}

export interface Home {
    bedrooms: {
        count: number;
        master: Room;
        additional: Room[];
    };
    bathrooms: {
        full: number;
        half: number;
        features: string[];
    };
    area: {
        interior: number;
        exterior: number;
        units: 'sqft' | 'sqm';
    };
    price: {
        amount: number;
        currency: string;
        history: {
            date: string;
            value: number;
        }[];
    };
    location: Address;
    amenities: {
        indoor: string[];
        outdoor: string[];
        community: string[];
    };
    yearBuilt: number;
    utilities: {
        heating: {
            type: string;
            fuelSource: string;
        };
        cooling: {
            type: string;
            zones: number;
        };
        internet: {
            available: boolean;
            providers: string[];
            maxSpeed: number;
        };
    };
} 