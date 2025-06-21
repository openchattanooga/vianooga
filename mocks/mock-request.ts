import { ItineraryStepRequestType } from '../types';

export const mockItineraryRequest: ItineraryStepRequestType['body'] = {
  itinerary: [
    {
      name: 'Starting Point',
      address: '100 Market St, Chattanooga, TN 37402',
      coordinates: {
        latitude: 35.0456,
        longitude: -85.3097
      }
    },
    {
      name: 'Hamilton Place Mall',
      address: '2100 Hamilton Place Blvd, Chattanooga, TN 37421',
      coordinates: {
        latitude: 35.0381,
        longitude: -85.1585
      }
    }
  ],
  targetDepartureTime: '2025-06-21T11:10:00Z',
  modes: ['WALK', 'BUS', 'CAR'],
  maxWalkingDistance: 500,
  maxBikingDistance: 2000,
  costPriority: 0.7,
  timePriority: 0.3
};

export const mockItineraryRequestAlternative: ItineraryStepRequestType['body'] = {
  itinerary: [
    {
      name: 'Tennessee Aquarium',
      coordinates: {
        latitude: 35.0559,
        longitude: -85.3115
      }
    },
    {
      name: 'Ruby Falls',
      address: '1720 Scenic Hwy, Chattanooga, TN 37409'
    },
    {
      name: 'Rock City',
      address: '1400 Patten Rd, Lookout Mountain, GA 30750'
    }
  ],
  targetDepartureTime: '2025-06-22T09:00:00Z',
  modes: ['CAR', 'BIKE', 'WALK'],
  costPriority: 0.2,
  timePriority: 0.8
};