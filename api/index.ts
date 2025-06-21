import express from 'express';
import { createServer } from 'http';

import { HealthResponseType, ItineraryStepRequestType, ItineraryStepResponseType } from '../types';
import { mockItineraryResponse } from '../mocks/mock-response';

const app = express();

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.json({
        status: 'healthy',
        service: 'vianooga',
        timestamp: new Date().toISOString()
    });
});

app.post('/itinerary/step', (req: express.Request<{}, {}, ItineraryStepRequestType['body']>, res: express.Response<ItineraryStepResponseType>) => {
    const { itinerary, targetDepartureTime, modes, maxWalkingDistance, maxBikingDistance, costPriority, timePriority } = req.body;

    console.log('Received itinerary request:', {
        itinerarySteps: itinerary.length,
        targetDepartureTime,
        modes,
        maxWalkingDistance,
        maxBikingDistance,
        costPriority,
        timePriority
    });

    res.json(mockItineraryResponse);
});



async function findAvailablePort(startPort: number = 3000, endPort: number = 3100): Promise<number> {
    for (let port = startPort; port <= endPort; port++) {
        try {
            await new Promise<void>((resolve, reject) => {
                const testServer = createServer();
                testServer.once('error', reject);
                testServer.once('listening', () => {
                    testServer.close(() => resolve());
                });
                testServer.listen(port);
            });
            return port;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`No available ports found between ${startPort} and ${endPort}`);
}

async function startServer() {
    try {
        const port = await findAvailablePort();

        app.listen(port, '0.0.0.0', () => {
            console.log(`Express server running on http://0.0.0.0:${port}`);
        });
    } catch (error) {
        console.error('Failed to start Express server:', error);
        process.exit(1);
    }
}

startServer();