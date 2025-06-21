import express from 'express';
import { createServer } from 'http';
import OpenAI from 'openai';

import { ItineraryStepRequestType, ItineraryStepResponseType } from '../types';
import { mockItineraryResponse } from '../mocks/mock-response';

const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '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',
});

app.use(express.json());

// Enable CORS for the React app
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.get('/', (res: express.Response) => {
    res.json({
        status: 'healthy',
        service: 'vianooga',
        timestamp: new Date().toISOString()
    });
});

async function generateItinerary(requestBody: ItineraryStepRequestType['body']): Promise<ItineraryStepResponseType> {
    const { itinerary, targetDepartureTime, modes, maxWalkingDistance, maxBikingDistance, costPriority, timePriority } = requestBody;

    // Build waypoints string from itinerary
    const waypoints = itinerary.map(step => {
        if (step.name) return step.name;
        if (step.address) return step.address;
        if (step.coordinates) return `${step.coordinates.latitude},${step.coordinates.longitude}`;
        return 'Unknown location';
    }).join(', ');

    // Convert priority scales
    // timePriority: 0 = least time, 1 = most time
    // In the prompt: 0 = scenic, 1 = efficient
    // So we need to invert: scenicToEfficient = 1 - timePriority
    const scenicToEfficient = 1 - timePriority;
    const cheapToExpensive = costPriority;

    // Read the system prompt
    const systemPrompt = `You are part of a navigation tool that suggests the best travel route to the user based on their preferences.

Input:
Itinerary which is a list of locations (waypoints) that must be included in the route. Each location will come in the form of address, coordinates, or name.
User preference Scenic to Efficient on a scale of 0.0 to 1.0.
User preference Cheap to Expensive on a scale of 0.0 to 1.0.
Mode of transportation: drive, bike, walk, public transportation.

Your task is to come up with possible routes that each satisfy every waypoint and cater to the user preferences.
Each segment between waypoints may use any mode of transportation that the user input allows.

Output:
3 route options

IMPORTANT: You must respond with valid JSON that matches the provided schema exactly.`;

    // Create user message
    const userMessage = `Waypoints: ${waypoints}
Scenic to Efficient: ${scenicToEfficient.toFixed(1)}
Cheap to Expensive: ${cheapToExpensive.toFixed(1)}
Modes: ${modes.map(m => m.toLowerCase()).join(', ')}
Target departure time: ${targetDepartureTime}
Max walking distance: ${maxWalkingDistance || 'unlimited'} meters
Max biking distance: ${maxBikingDistance || 'unlimited'} meters`;

    // Define JSON schema for the response
    const jsonSchema = {
        "type": "object",
        "properties": {
            "status": {
                "type": "string",
                "enum": ["success", "error"]
            },
            "data": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Unique identifier for this itinerary request"
                    },
                    "choices": {
                        "type": "array",
                        "minItems": 1,
                        "maxItems": 3,
                        "items": {
                            "type": "object",
                            "properties": {
                                "steps": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "address": { "type": "string" },
                                            "coordinates": {
                                                "type": "object",
                                                "properties": {
                                                    "latitude": { "type": "number" },
                                                    "longitude": { "type": "number" }
                                                },
                                                "required": ["latitude", "longitude"]
                                            },
                                            "mode": {
                                                "type": "string",
                                                "enum": ["WALK", "BIKE", "CAR", "BUS", "TRAIN"]
                                            },
                                            "duration": {
                                                "type": "number",
                                                "description": "Duration in seconds"
                                            },
                                            "distance": {
                                                "type": "number",
                                                "description": "Distance in meters"
                                            },
                                            "cost": {
                                                "type": "number",
                                                "description": "Cost in currency units"
                                            },
                                            "description": { "type": "string" }
                                        },
                                        "required": ["address", "coordinates", "mode", "duration", "distance", "cost", "description"]
                                    }
                                },
                                "totalDuration": { "type": "number" },
                                "totalDistance": { "type": "number" },
                                "totalCost": { "type": "number" },
                                "possibleStartTimes": {
                                    "type": "array",
                                    "items": { "type": "string" }
                                }
                            },
                            "required": ["steps", "totalDuration", "totalDistance", "totalCost", "possibleStartTimes"]
                        }
                    }
                },
                "required": ["id", "choices"]
            }
        },
        "required": ["status", "data"],
        "additionalProperties": false
    };

    try {
        console.log('Sending request to OpenAI with waypoints:', waypoints);
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            response_format: { 
                type: "json_schema", 
                json_schema: {
                    name: "itinerary_response",
                    schema: jsonSchema,
                    strict: true
                }
            },
            temperature: 0.3,
            top_p: 0.7,
        });

        console.log('OpenAI raw response received');
        const responseData = JSON.parse(completion.choices[0].message.content || '{}');
        console.log('Parsed response with', responseData.data?.choices?.length || 0, 'route choices');
        return responseData as ItineraryStepResponseType;
    } catch (error: any) {
        console.error('Error generating itinerary:', error);
        if (error.response) {
            console.error('OpenAI API error response:', error.response.data);
        }
        return {
            status: 'error',
            error: 'Failed to generate itinerary'
        };
    }
}

app.post('/itinerary', async (req: express.Request<{}, {}, ItineraryStepRequestType['body']>, res: express.Response<ItineraryStepResponseType>) => {
    console.log('Received itinerary request:', {
        itinerarySteps: req.body.itinerary.length,
        targetDepartureTime: req.body.targetDepartureTime,
        modes: req.body.modes,
        maxWalkingDistance: req.body.maxWalkingDistance,
        maxBikingDistance: req.body.maxBikingDistance,
        costPriority: req.body.costPriority,
        timePriority: req.body.timePriority
    });

    // Check if we should use mock response (for development/testing)
    const useMock = process.env.USE_MOCK_RESPONSE === 'true';
    
    if (useMock) {
        console.log('Using mock response');
        res.json(mockItineraryResponse);
        return;
    }

    try {
        console.log('Calling OpenAI API...');
        const response = await generateItinerary(req.body);
        console.log('OpenAI response received');
        res.json(response);
    } catch (error) {
        console.error('Error in /itinerary endpoint:', error);
        res.json({
            status: 'error',
            error: 'Internal server error'
        });
    }
});

async function findAvailablePort(startPort: number = 3001, endPort: number = 3100): Promise<number> {
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