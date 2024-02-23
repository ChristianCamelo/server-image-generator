const usuarios = require('../users.json')
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secret = "kjbfirebvirbvuirb89gt541h65thkrj%&533c34&$"

function checkPwd(user, password, callback) {
    const pwd = password;
    const username = user;
    
    if (!pwd || !username) {
        callback(1, null);
        return;
    }
    // Buscar el usuario en el archivo usuarios.json
    const usuario = usuarios.find(u => u.username === username);
    if (!usuario) {
        callback(-1, null);
        return;
    }
    const pwdSaved = usuario.password;
    console.log("PASSWORD RECIBIDA :", pwd)
    console.log("PASSWORD ALMACEDA :", pwdSaved)
    bcrypt.compare(pwd, pwdSaved, function (err, match) {
        if (err) {
            console.error('Error al comparar contraseñas:', err);
            callback(-1, null);
            return;
        }
        if (match) {
            const token = jwt.sign({ username: username }, secret, { expiresIn: '1h' });
            callback(2, token);
            return;
        } else {
            callback(1, null);
            return;
        }
    });
}


module.exports = checkPwd;