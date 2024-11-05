// Define a type structure that mirrors our TypeScript types
export type TypeStructure = {
  [key: string]: {
    type: string;
    isOptional?: boolean;
    isArray?: boolean;
    arrayType?: string;
    properties?: TypeStructure;
    enum?: string[];
  }
}

// Create a static type definition that we'll use for autocompletion
export const HOME_TYPE_STRUCTURE: TypeStructure = {
  bedrooms: {
    type: 'object',
    properties: {
      count: { type: 'number' },
      master: {
        type: 'object',
        properties: {
          dimensions: {
            type: 'object',
            properties: {
              width: { type: 'number' },
              length: { type: 'number' },
              height: { type: 'number' }
            }
          },
          windows: { type: 'number' },
          features: { type: 'array', arrayType: 'string' }
        }
      },
      additional: { type: 'array', arrayType: 'Room' }
    }
  },
  bathrooms: {
    type: 'object',
    properties: {
      full: { type: 'number' },
      half: { type: 'number' },
      features: { type: 'array', arrayType: 'string' }
    }
  },
  area: {
    type: 'object',
    properties: {
      interior: { type: 'number' },
      exterior: { type: 'number' },
      units: { type: 'string', enum: ['sqft', 'sqm'] }
    }
  },
  price: {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      currency: { type: 'string' },
      history: {
        type: 'array',
        arrayType: 'object',
        properties: {
          date: { type: 'string' },
          value: { type: 'number' }
        }
      }
    }
  },
  location: {
    type: 'object',
    properties: {
      street: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      zipCode: { type: 'string' },
      coordinates: {
        type: 'object',
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' }
        }
      }
    }
  },
  amenities: {
    type: 'object',
    properties: {
      indoor: { type: 'array', arrayType: 'string' },
      outdoor: { type: 'array', arrayType: 'string' },
      community: { type: 'array', arrayType: 'string' }
    }
  },
  yearBuilt: { type: 'number' },
  utilities: {
    type: 'object',
    properties: {
      heating: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          fuelSource: { type: 'string' }
        }
      },
      cooling: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          zones: { type: 'number' }
        }
      },
      internet: {
        type: 'object',
        properties: {
          available: { type: 'boolean' },
          providers: { type: 'array', arrayType: 'string' },
          maxSpeed: { type: 'number' }
        }
      }
    }
  }
}