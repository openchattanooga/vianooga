import { ItineraryStepResponseType } from '../types';

export const mockItineraryResponse: ItineraryStepResponseType = {
    status: 'success',
    data: {
        id: 'mock-itinerary-12345',
        choices: [
            {
                steps: [
                    {
                        address: '100 Market St, Chattanooga, TN 37402',
                        coordinates: {
                            latitude: 35.0456,
                            longitude: -85.3097
                        },
                        mode: 'WALK',
                        duration: 300,
                        distance: 250,
                        cost: 0,
                        description: 'Walk 250 meters to Chattanooga Station'
                    },
                    {
                        address: 'Chattanooga Station, 1400 Market St, Chattanooga, TN 37402',
                        coordinates: {
                            latitude: 35.0445,
                            longitude: -85.3089
                        },
                        mode: 'BUS',
                        duration: 1200,
                        distance: 8500,
                        cost: 2.5,
                        description: 'Take Bus Route 4 towards Hamilton Place Mall'
                    },
                    {
                        address: '2100 Hamilton Place Blvd, Chattanooga, TN 37421',
                        coordinates: {
                            latitude: 35.0381,
                            longitude: -85.1585
                        },
                        mode: 'WALK',
                        duration: 180,
                        distance: 150,
                        cost: 0,
                        description: 'Walk 150 meters to destination'
                    }
                ],
                totalDuration: 1680,
                totalDistance: 8900,
                totalCost: 2.5,
                possibleStartTimes: [
                    '2025-06-21T11:10:00Z',
                    '2025-06-21T11:40:00Z',
                    '2025-06-21T12:10:00Z'
                ]
            },
            {
                steps: [
                    {
                        address: '100 Market St, Chattanooga, TN 37402',
                        coordinates: {
                            latitude: 35.0456,
                            longitude: -85.3097
                        },
                        mode: 'CAR',
                        duration: 900,
                        distance: 11200,
                        cost: 3.5,
                        description: 'Drive via I-24 E and US-27 N'
                    }
                ],
                totalDuration: 900,
                totalDistance: 11200,
                totalCost: 3.5,
                possibleStartTimes: [
                    '2025-06-21T11:10:00Z'
                ]
            }
        ]
    }
};