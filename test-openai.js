const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: ''
});

async function testSimple() {
    try {
        console.log('Testing simple OpenAI call...');
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say hello" }
            ],
            temperature: 0.3,
        });
        console.log('Success:', completion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

async function testStructured() {
    try {
        console.log('\nTesting structured output...');
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Generate a simple route." },
                { role: "user", content: "Route from A to B" }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "simple_route",
                    schema: {
                        type: "object",
                        properties: {
                            route: { type: "string" }
                        },
                        required: ["route"],
                        additionalProperties: false
                    },
                    strict: true
                }
            },
            temperature: 0.3,
        });
        console.log('Success:', completion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testSimple().then(() => testStructured());