document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("weatherForm");
    const responseDiv = document.getElementById("response");
    const pastIdeasLink = document.getElementById("pastIdeasLink");
    const pastIdeasDiv = document.getElementById("pastIdeas");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const weatherInput = document.getElementById("weather").value;
        const childAgeInput = document.getElementById("childAge").value;

        try {
            const response = await generateResponse(weatherInput, childAgeInput);
            const responseText = response.choices[0].message.content;
            responseDiv.textContent = responseText; // Set div content to text
            await saveResponse(weatherInput, childAgeInput, responseText); // calls server to save to database
        } catch (error) {
            console.error("Error generating response:", error);
            responseDiv.textContent = "An error occurred while generating a response.";
        }
    });

    pastIdeasLink.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            const pastResponses = await getPastResponses();
            pastIdeasDiv.innerHTML = "";

            pastResponses.response.forEach((response) => {
                const responseDiv = document.createElement("div");
                responseDiv.textContent = `Weather: ${response.weather}, Child Age: ${response.childAge}, Response: ${response.text}`;
                pastIdeasDiv.appendChild(responseDiv);
            });
        } catch (error) {
            console.error("Error getting past responses:", error);
            pastIdeasDiv.innerHTML = "An error occurred while fetching past responses.";
        }
    });

    async function generateResponse(weather, childAge) {
        const apiUrl = "/openai-api";

        const prompt = `Given the weather in Singapore is ${weather} and my child is ${childAge} years old,`;

        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that gives one top recommendation. Give a different recommendation each time."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        return response.json();
    }

    async function saveResponse(responseWeather, responseChildAge, responseText) {
        const apiUrl = "/api/response/store"; // "Store" API endpoint

        const requestBody = {
            weather: responseWeather,
            childAge: responseChildAge,
            text: responseText
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
        } catch (error) {
            console.error("Error saving response:", error);
        }
    }
    
    async function getPastResponses() {
        const apiUrl = "/api/response"; // "Get" API endpoint
        
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
});
