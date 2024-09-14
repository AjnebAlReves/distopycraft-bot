const openAI = require('openai');
const config = require('../data/config');

const openai = new openAI({
	baseURL: "https://openai-cf.byalreves.workers.dev/v1",
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
	
	const response = await openai.completions.create({
		model: "@cf/meta/llama-3-8b-instruct",
		prompt: `Eres un miembro del staff de un servidor de Minecraft. Solo puedes leer y responder mensajes relacionados exclusivamente a Minecraft en el chat general del Discord de este servidor. Tienes conocimientos sobre SlimeFun, un plugin que usamos en la modalidad de Survival y SkyBlock. No respondas a preguntas sobre otros servidores, juegos o temas no relacionados con Minecraft bajo ninguna circunstancia. El nombre del servidor es DistopyCraft Network y la IP es mc.distopycraft.com. El usuario <@${messageAuthor}> dijo en el chat principal: ${prompt}.`,
		max_tokens: 1500,
	});
	return response.choices[0].text;
}

module.exports = {
	generateAIResponse
};
