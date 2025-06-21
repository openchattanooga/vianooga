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
    "type": "object",
    "properties": {
        "benefits": {
            "type": "array",
            "description": "A list of benefits of using the OpenAI API.",
            "items": {
                "type": "string"
            }
        },
        "key_features": {
            "type": "array",
            "description": "A list of key features of the OpenAI API.",
            "items": {
                "type": "string"
            }
        }
    },
    "required": ["benefits", "key_features"], # Ensure these properties are always present
    "additionalProperties": False # Crucial for enforcing the schema: no extra properties allowed
}

# Define the conversation messages
messages = [
    {"role": "system", "content": "You are a helpful assistant that provides responses in JSON format according to the provided schema."}, # Mention schema in the system prompt
    {"role": "user", "content": "Tell me about the benefits and key features of using the OpenAI API."}
]

# Make the API call with the JSON Schema response format
completion = client.chat.completions.create(
  model="gpt-4o-mini", # Use a model that supports JSON Schema structured outputs, like gpt-4o-mini or gpt-4o
  messages=messages,
  response_format={"type": "json_schema", "json_schema": json_schema, "strict": True} # Specify JSON Schema and strict mode
)

# Parse the JSON response
try:
    response_data = json.loads(completion.choices[0].message.content)
    # Now you can work with the structured data in response_data
    print(json.dumps(response_data, indent=4))
except json.JSONDecodeError as e:
    print(f"Error decoding JSON response: {e}")
    print("Raw response content:", completion.choices[0].message.content)