
const axios = require('axios');

const discordAPI = `https://discord.com/api/v10`;
const MidjourneyAppId = `936929561302675456`;
const MidjourneyVersion = `1166847114203123795`;
const discord = `MTEzMDc0MzQ4OTU3MTg2ODc1NA.GqeO59.wJYkjErhNyhtshTGNvf6MR0-uFYy1xAcP4Z02M`;
const server = `1204813483431034911`; // IGUAL

const promptparams = "realistic image, by canon 5 R.High resolution. Photorealistic lighting, 8K. Super Resolution, Megapixel, Pro Photo | 8k 35mm, 8k, depth of field --iw 0.5 --v 6.0 --ar 16:9"

var messageId = ""
var customId = ""

let preprompt = [];
let promptsHistory = [];

const DiscordHeaders = (token) => ({
	"Content-Type": "application/json",
	"Accept": 'application/json',
	"Authorization": token
});

function getNonce() {
	const range = 99999999999999999 - 1 + 1;
	const value = Math.floor(Math.random() * range) + 1;
	return value.toString();
}

function getSession() {
	return (new Date()).getTime()
}

async function GetDiscordChannelMessages(channel) {
	try {
		console.log('GetDiscordChannelMessages: Haciendo fecth de los mensajes canal :',channel)
		const response = await axios.get(
			`${discordAPI}/channels/${channel}/messages`,
			{ headers: DiscordHeaders(discord) }
		);
        console.log('GetDiscordChannelMessages : Devolviendo mensajes ',response.data.length)
		return response.data;
	} catch (error) {
		console.error('GetDiscordChannelMessages: Error al obtener mensajes del canal:', error);
		throw error;
	}
}
async function PostDiscordImagine(prompt, channel) {
    try {
		console.log("PostDiscordImagine: pidiendo prompt ", prompt," canal",channel)
        const nonce = await getNonce();
        const session_id = await getSession();

        const response = await axios.post(
            `${discordAPI}/interactions`,
            {
                "type": 2,
                "application_id": MidjourneyAppId,
                "guild_id": server,
                "channel_id": channel,
                "session_id": session_id,
                "data": {
                    "version": MidjourneyVersion,
                    "id": "938956540159881230",
                    "name": "imagine",
                    "type": 1,
                    "options": [
                        {
                            "type": 3,
                            "name": "prompt",
                            "value": prompt
                        }
                    ],
                    "application_command": {
                        "id": "938956540159881230",
                        "type": 1,
                        "application_id": "936929561302675456",
                        "version": MidjourneyVersion,
                        "name": "imagine"
                    },
                    "attachments": []
                },
                "nonce": nonce,
                "analytics_location": "slash_ui"
            },
            { headers: DiscordHeaders(discord) }
        );

        if (response.status === 204) {
            console.log('PostDiscordImagine: La solicitud fue exitosa pero no hay contenido.');
            return;
        } else {
            console.error('PostDiscordImagine: La solicitud no fue exitosa:', response.statusText);
            throw new Error('PostDiscordImagine: La solicitud no fue exitosa: ' + response.statusText);
        }
    } catch (error) {
        console.error('PostDiscordImagine: Error en la solicitud de Discord');
        throw error;
    }
}


async function CheckResults(channel) {
	var result = await GetDiscordChannelMessages();
	if (result[0]['components'].length !== 0) {
		//  GENERACION TERMINADA , IMAGEN 100%
		// ALMACENA LOS VALORES DE LA IMAGEN PARA OBTENER IMAGEN Y VARIACION
		messageId = result[0]['id']; // obtiene el id del mensaje
		const image = result[0]['attachments'][0]['url'];
		customId = result[0]['components'][0]['components'][0]['custom_id'].split("::").pop(); // obtiene el hash de la imagen

		//console.log("Check Results: Prompt History " + JSON.stringify(promptsHistory));
		const data = { status: true, progress: "100", image: image, result: result }
		return (data);
	} else {
		// VERIFICA EL ESTADO DE LA GENERACION
		const regex = /\((\d+)%\)/;
		const match = result[0]['content'].match(regex);
		let valor = "0";
		if (match && match[1]) {
			valor = match[1];
		}
		const data = { status: false, progress: valor, image: "", result: result };
		//console.log(data)
		return (data);
	}
}
// Le entrego el id del mensaje, el hash, la opcion que quiero por default 2, la imagen numero 1...4 y el canal
async function PostInteraction(messageId, customId, option, image, channel) {
	try {
		const nonce = await getNonce();
		const session_id = await getSession();

		// OPCION 1 VARIAR, OPCION 2 ESCALAR
		const variationSetup = "MJ::JOB::variation::";
		const upsampleSetup = "MJ::JOB::upsample::";

		var picked = "";

		if (option === 1) {
			picked = variationSetup;
		}
		if (option === 2) {
			picked = upsampleSetup;
		}

		const response = await axios.post(
			`${discordAPI}/interactions`,
			{
				"type": 3,
				"nonce": nonce,
				"guild_id": server,
				"channel_id": channel,
				"message_flags": 0,
				"message_id": messageId,
				"application_id": MidjourneyAppId,
				"session_id": session_id,
				"data": {
					"component_type": 2,
					"custom_id": picked + image + "::" + customId
				}
			},
			{ headers: DiscordHeaders(discord) }
		);
		if (response.status === 204) {
			console.log('GetInteraction: La solicitud fue exitosa pero no hay contenido.');
			return;
		} else if (!response.ok) {
			throw new Error('GetInteraction: La solicitud no fue exitosa: ' + response.statusText);
		}
		return response;
	} catch (error) {
		console.error('GetInteraction: Error en la solicitud de Discord:', error);
		throw error;
	}
}

function splitHash(hashStr) {
	const parts = hashStr.split("::");
	const customId = parts.pop();  // Extrae y remueve el último elemento (UUID)
	const mj = parts.join("::");   // Une los elementos restantes con "::"
	return { custom_id: customId, MJ: mj };
}

module.exports = {
    splitHash, 
    GetDiscordChannelMessages, 
    PostInteraction, 
    CheckResults,
    PostDiscordImagine
}