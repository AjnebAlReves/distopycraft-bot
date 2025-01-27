const openAI = require('openai');
const config = require('../data/config');

const openai = new openAI({
	baseURL: "https://models.inference.ai.azure.com",
	apiKey: config.apis.tokens.aiApi,
});

async function generateAIResponse(prompt, messageAuthor) {
	if (!prompt) return;
	if (prompt.length > 1000) return;
	if (prompt.length < 1) return;
	if (prompt.includes("http")) {
		return "No puedes enviar URLs en el chat principal.";
	}
	console.log(`[AI Log] ${messageAuthor} ha enviado el siguiente mensaje: ${prompt}`);

	try {
		const response = await openai.chat.completions.create({
			messages: [
				{ 
					role: "system", 
					content: "Eres un miembro del staff de un servidor de Minecraft. Solo puedes leer y responder mensajes relacionados exclusivamente a Minecraft en el chat general del Discord de este servidor. Tienes conocimientos sobre SlimeFun, un plugin que usamos en la modalidad de Survival y SkyBlock. No respondas a preguntas sobre otros servidores, juegos o temas no relacionados con Minecraft bajo ninguna circunstancia. El nombre del servidor es DistopyCraft Network y la IP es mc.distopycraft.com."
				},
				{ 
					role: "user", 
					content: prompt 
				}
			],
			temperature: 1.0,
			top_p: 1.0,
			max_tokens: 1500,
			model: "gpt-4o"
		});

		return response.choices[0].message.content;
	} catch (err) {
		if (err.response.startsWith("Request failed with status code 429")) {
			return "Estoy recibiendo demasiadas solicitudes en este momento. Por favor, intenta de nuevo más tarde.";
		} else if (err.response.startsWith("Request failed with status code 401")) {
			return "No tengo permiso para enviar mensajes en este canal. Por favor, contacta a un administrador.";
		} else if (err.response.startsWith("Request failed with status code 403")) {
			return "No tengo permiso para enviar mensajes en este canal. Por favor, contacta a un administrador.";
		} else if (err.response.startsWith("Request failed with status code 404")) {
			return "No tengo permiso para enviar mensajes en este canal. Por favor, contacta a un administrador.";
		} else if (err.response.startsWith("Request failed with status code 500")) {
			return "Ocurrió un error al intentar obtener una respuesta de la IA. Por favor, intenta de nuevo más tarde.";
		} else if (err.response.startsWith("400 The response was filtered")) {
			return "Lo siento, no puedo responder a esa pregunta. La pregunta contiene información sensible o no es apropiada.";
		}
		console.error("Error in AI response:", err);
		return `Ocurrió un error al intentar obtener una respuesta de la IA. Por favor, intenta de nuevo más tarde. ${err.message}`;
	}
}

module.exports = {
	generateAIResponse
};
