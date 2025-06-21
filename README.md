# vianooga
An OSS platform for planning and traversing Chattanooga.

## API Specification

### Example Request

```bash
curl -s -X POST http://vianooga.4rd.ai:3000/itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "itinerary": [
      {
        "name": "Starting Point",
        "address": "100 Market St, Chattanooga, TN 37402",
        "coordinates": {
          "latitude": 35.0456,
          "longitude": -85.3097
        }
      },
      {
        "name": "Hamilton Place Mall",
        "address": "2100 Hamilton Place Blvd, Chattanooga, TN 37421",
        "coordinates": {
          "latitude": 35.0381,
          "longitude": -85.1585
        }
      }
    ],
    "targetDepartureTime": "2025-06-21T11:10:00Z",
    "modes": ["WALK", "BUS", "CAR"],
    "maxWalkingDistance": 500,
    "maxBikingDistance": 2000,
    "costPriority": 0.7,
    "timePriority": 0.3
  }' | python3 -m json.tool
```
