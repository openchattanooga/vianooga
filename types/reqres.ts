
export type ItineraryStepRequestType = {
    method: 'POST';
    body: {
        itinerary: Array<{
            address?: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            };
            name?: string;
        }>;
        targetDepartureTime: string; // ISO 8601 format (2025-06-21T11:10:45Z)
        modes: Array<'WALK' | 'BIKE' | 'CAR' | 'BUS' | 'TRAIN'>;
        maxWalkingDistance?: number; // in meters
        maxBikingDistance?: number; // in meters
        costPriority: number; // 0 to 1, where 0 is least cost and 1 is most cost
        timePriority: number; // 0 to 1, where 0 is least time and 1 is most time
    };
};

export type ItineraryStepResponseType = {
    status: 'success' | 'error';
    data?: {
        id: string; // unique identifier for the request to the system
        choices: Array<{
            steps: Array<{
                address: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                };
                mode: 'WALK' | 'BIKE' | 'CAR' | 'BUS' | 'TRAIN'; // from this point to next
                duration: number; // in seconds
                distance: number; // in meters
                cost: number; // in currency units
                description: string; // human-readable description of the step
            }>;
            totalDuration: number; // in seconds
            totalDistance: number; // in meters
            totalCost: number; // in currency units
            possibleStartTimes: Array<string>; // ISO 8601 format (2025-06-21T11:10:45Z)
        }>;
    };
    error?: string; // error message if status is 'error'
}
