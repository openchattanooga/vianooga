import os
import json
from openai import OpenAI

user_content = "Chattanooga Aquarium, The Edney, The Moxy"
token = os.getenv("OPENAI_API_KEY")

print(token[-4:])

# client = OpenAI(base_url="https://api.openai.com/v1", api_key=token)

# with open("prompt.txt", "r") as f:
#     prompt = "".join(f.readlines())

# system_message = {"role": "system", "content": prompt}

# user_message = {
#     "role": "user",
#     "content": user_content,
# }

# response = client.chat.completions.create(
#     messages=[system_message, user_message],
#     temperature=0.3,
#     top_p=0.7,
#     model="o4-mini",
# )

# print(response.choices[0].message.content)

# Initialize the OpenAI client
client = OpenAI()

# Define the desired JSON Schema for the response
json_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Itinerary",
  "description": "Represents a travel itinerary with multiple route choices.",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the itinerary."
    },
    "choices": {
      "type": "array",
      "description": "An array of possible itinerary choices.",
      "items": {
        "type": "object",
        "properties": {
          "steps": {
            "type": "array",
            "description": "An array of individual steps within a choice.",
            "items": {
              "type": "object",
              "properties": {
                "address": {
                  "type": "string",
                  "description": "Address of the step location."
                },
                "coordinates": {
                  "type": "object",
                  "properties": {
                    "latitude": {
                      "type": "number",
                      "description": "Latitude coordinate."
                    },
                    "longitude": {
                      "type": "number",
                      "description": "Longitude coordinate."
                    }
                  },
                  "required": [
                    "latitude",
                    "longitude"
                  ]
                },
                "mode": {
                  "type": "string",
                  "description": "Transportation mode (e.g., WALK, BUS)."
                },
                "duration": {
                  "type": "integer",
                  "description": "Duration of the step in seconds."
                },
                "distance": {
                  "type": "integer",
                  "description": "Distance of the step in meters."
                },
                "cost": {
                  "type": "number",
                  "description": "Cost of the step (e.g., fare)."
                },
                "description": {
                  "type": "string",
                  "description": "Description of the step."
                }
              },
              "required": [
                "address",
                "coordinates",
                "mode",
                "duration",
                "distance",
                "cost",
                "description"
              ],
              "additionalProperties": False
            }
          },
          "totalDuration": {
            "type": "integer",
            "description": "Total duration of the choice in seconds."
          },
          "totalDistance": {
            "type": "integer",
            "description": "Total distance of the choice in meters."
          },
          "totalCost": {
            "type": "number",
            "description": "Total cost of the choice."
          },
          "possibleStartTimes": {
            "type": "array",
            "description": "An array of possible start times.",
            "items": {
              "type": "string",
              "format": "date-time",
              "description": "Start time in ISO 8601 format."
            }
          }
        },
        "required": [
          "steps",
          "totalDuration",
          "totalDistance",
          "totalCost",
          "possibleStartTimes"
        ],
        "additionalProperties": False
      }
    }
  },
  "required": [
    "id",
    "choices"
  ],
  "additionalProperties": False
}

# Define the conversation messages
messages = [
    {"role": "system", "content": "You are a helpful assistant that provides responses in JSON format according to the provided schema."}, # Mention schema in the system prompt
    {"role": "user", "content": "Give me the route from the San Francisco Golden Gate Bridge to the Chattanooga Aquarium."}
]

# Make the API call with the JSON Schema response format
completion = client.chat.completions.create(
  model="gpt-4o-mini", # Use a model that supports JSON Schema structured outputs, like gpt-4o-mini or gpt-4o
  messages=messages,
  response_format={"type": "json_schema", "json_schema": {"schema":json_schema, "name":"json_schema"}} # Specify JSON Schema and strict mode
)

# Parse the JSON response
try:
    response_data = json.loads(completion.choices[0].message.content)
    # Now you can work with the structured data in response_data
    print(json.dumps(response_data, indent=4))
except json.JSONDecodeError as e:
    print(f"Error decoding JSON response: {e}")
    print("Raw response content:", completion.choices[0].message.content)