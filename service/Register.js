const usuarios = require('../users.json');
const fs = require('fs');
const bcrypt = require('bcrypt');

function register(username, password, callback) {
    // Contar cuántos usuarios hay
    const numUsers = usuarios.length;

    // Obtener el ID del último usuario
    const lastUserID = numUsers > 0 ? usuarios[numUsers - 1].ID : 0;

    // Calcular el ID para el nuevo usuario
    const newUserID = lastUserID + 1;

    const usuario = usuarios.find(u => u.username === username);
    if (!usuario) {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                console.error('Error al generar el hash de la contraseña:', err);
                callback(-1);
                return;
            }
            const newUser = { ID: newUserID, username: username, password: hash };
            // Leer el contenido actual del archivo users.json
            fs.readFile('users.json', 'utf8', function (err, data) {
                if (err) {
                    console.error('Error al leer el archivo users.json:', err);
                    callback(-1);
                    return;
                }
                let users = [];
                if (data) {
                    users = JSON.parse(data);
                }
                users.push(newUser);
                fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf8', function (err) {
                    if (err) {
                        console.error('Error al escribir en el archivo users.json:', err);
                        callback(-1);
                        return;
                    }
                    callback(2);
                });
            });
        });
    } else { callback(1) }
}

module.exports = register;