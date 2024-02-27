const jwt = require('jsonwebtoken');
const fs = require('fs');

const secret = "kjbfirebvirbvuirb89gt541h65thkrj%&533c34&$";

function verificarToken(token, callback) {
    if (!token) {
        callback({ status: -2, user: null });
        return;
    }
    //console.log("verificarToken: ",token)
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            callback({ status: -1, user: null, channel: null });
            return;
        }
        // Verificación exitosa, devuelve el usuario decodificado
        const channel = findChannelByUsername(decoded.username, function (channel) {
            callback({ status: 1, user: decoded, channel: channel });
            return;
        });
    });
}

async function getStyle(id) {
    try {
        console.log("buildPrompt: buscando estilo ", id);
        const data = await fs.promises.readFile('styles.json', 'utf8');
        const database = JSON.parse(data);
        console.log(data)
        const style = database.find(s => s.ID === id);
        if (style) {
            console.log("getStyle: ",style.settings)
            return s.settings;
        }
        else {
            console.log("Error: Estilo no encontrado")
            return ""
        }
    } catch (err) {
        console.error('Error al leer el archivo de la base de datos:', err);
        throw err; // Reenviar el error para que se maneje externamente
    }
}

// QUEDE AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII <------------------------------------

async function buildPrompt(username, body) {
    console.log("buildPrompt: buscando a ", username);
    try {
        const data = await fs.promises.readFile('users.json', 'utf8');
        const database = JSON.parse(data);
        const cliente = database.find(u => u.username === username);
        if (cliente) {
            let prompt = body.prompt + " ";
            //console.log("buildPrompt: usuario es: ", cliente);
            prompt += cliente.colors + " ";
            // Desarmar los tags y ensamblar
            const tags = body.tags.split('$$');
            prompt += tags.join(" ");
            const style = await getStyle(body.style);
            prompt += style + " ";
            const creative = "--stylize " + (750 * Number(body.creative)).toString() + " ";
            prompt += creative;
            const quality = "--quality " + body.quality + " ";
            prompt += quality;
            const aspect = "--aspect " + body.aspect + " "
            prompt += aspect;
            // agregar
            return prompt;
        } else {
            console.log(`No se encontró ningún cliente con el nombre de usuario '${username}'.`);
            return prompt;
        }
    } catch (err) {
        console.error('Error al leer el archivo de la base de datos:', err);
        throw err; // Reenviar el error para que se maneje externamente
    }
}


function findChannelByUsername(username, callback) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error('Error al leer el archivo de la base de datos:', err);
            callback(null);
            return;
        }
        //console.log("user ",username)
        const database = JSON.parse(data);
        const cliente = database.find(u => u.username === username);
        if (cliente) {
            console.log("Usuario es: ", cliente)
            const channel = cliente.channel;
            callback(channel);
        } else {
            console.log(`No se encontró ningún cliente con el nombre de usuario '${username}'.`);
            callback(null);
        }
    });
}

module.exports = { buildPrompt, verificarToken, findChannelByUsername };

