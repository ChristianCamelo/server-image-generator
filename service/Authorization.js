const jwt = require('jsonwebtoken');
const fs = require('fs');

const secret = "kjbfirebvirbvuirb89gt541h65thkrj%&533c34&$";

function verificarToken(token, callback) {
    if (!token) {
        callback({ status: -2, user: null });
        return;
    }
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            callback({ status: -1, user: null , channel:null});
            return;
        }
        // Verificación exitosa, devuelve el usuario decodificado
        const channel = findChannelByUsername(decoded.username, function(channel) {
            callback({ status: 1, user: decoded , channel : channel});
            return;
        });
    });
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
            //console.log("Usuario es: ",cliente)
            const channel = cliente.channel;
            callback(channel);
        } else {
            console.log(`No se encontró ningún cliente con el nombre de usuario '${username}'.`);
            callback(null);
        }
    });
}

module.exports = { verificarToken, findChannelByUsername };

