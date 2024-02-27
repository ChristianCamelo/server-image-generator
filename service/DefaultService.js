'use strict';



/**
 * Iniciar sesión
 * Endpoint para iniciar sesión de usuario
 *
 * body Login_body 
 * returns inline_response_200
 **/

const checkPwd = require('./Password')
const register = require('./Register');
const { GetDiscordChannelMessages, PostDiscordImagine, PostInteraction } = require('./Discord');
const { verificarToken, buildPrompt } = require('./Authorization')

exports.loginPOST = function (body) {
  return new Promise(function (resolve, reject) {
    checkPwd(body.name, body.pwd, function (status, token) {
      if (status === 2) {
        resolve({ status: 200, message: "USER_CORRECT", token: token });
      } else if (status === -1) {
        resolve({ status: 201, message: "USER_NOT_EXIST" });
      } else if (status === 1) {
        resolve({ status: 202, message: "USER_INCORRECT" });
      } else {
        reject(new Error("Error desconocido al iniciar sesión"));
      }
    });
  });
};

/**
 * Obtener mensajes
 * Endpoint para obtener mensajes
 *
 * returns inline_response_200_2
 **/

exports.messagesGET = function (req) {
  console.log("##################-MESSAGES GET-##################")
  //console.log(req.headers.authorization)
  return new Promise(async (resolve, reject) => {
    try {
      const { status, channel } = await new Promise((resolve, reject) => {
        verificarToken(req.headers.authorization, (status, channel) => {
          resolve({ status, channel });
        });
      });
      //console.log(req.headers.authorization)
      switch (status.status) {
        case 1:
          const messages = await GetDiscordChannelMessages(status.channel);
          resolve({ message: messages });
          break;
        case -1:
          resolve({ message: "usuario no autorizado" });
          break;
        default:
          resolve({ message: "estado de token desconocido" });
          break;
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      reject({ status: -1, user: null });
    }
  });
};


/**
 * Crear mensaje
 * Endpoint para crear un nuevo mensaje
 *
 * body Messages_body 
 * returns inline_response_200_3
 **/
exports.messagesPOST = function (req, body) {
  console.log("##################-MESSAGES POST INIT-##################")
  return new Promise(async (resolve, reject) => {
    try {
      //console.log(body)
      const { status, channel } = await new Promise((resolve, reject) => {
        verificarToken(req.headers.authorization, (status) => {
          resolve({ status });
          console.log("messagesPOST: user: ", status)
        });
      });
      console.log("messagesPOST recibe: ", body, " channel: ", status.channel)
      switch (status.status) {
        case 1:
          try {
            const resultado = await buildPrompt(status.user.username, body);
            await PostDiscordImagine(resultado, status.channel);
            resolve({ message: "usuario autorizado" });
            console.log("##################-MESSAGES POST CLOSE-##################")
          } catch (error) {
            console.error('Error en la solicitud de Discord o al construir el prompt:', error);
            console.log("##################-MESSAGES POST CLOSE-##################")
          }
          break;
        case -1:
          resolve({ message: "usuario no autorizado" });
          console.log("##################-MESSAGES POST CLOSE-##################")
          break;
        default:
          resolve({ message: "estado de token desconocido" });
          console.log("##################-MESSAGES POST CLOSE-##################")
          break;
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      console.log("##################-MESSAGES POST CLOSE-##################")
      reject({ status: -1, user: null });
    }
  });
}


/**
 * Crear accion
 * Endpoint para crear un nuevo accion
 *
 * body Messages_body 
 * returns inline_response_200_3
 **/
exports.actionPOST = function (req, body) {
  return new Promise(async (resolve, reject) => {
    try {
      const { status, channel } = await new Promise((resolve, reject) => {
        verificarToken(req.headers.authorization, (status, channel) => {
          resolve({ status, channel });
        });
      });
      console.log(req)
      //console.log(status)
      switch (status.status) {
        case 1:
          console.log(body)
          //const messages = await PostInteraction(body);
          resolve({ message: "recibida accion" });
          break;
        case -1:
          resolve({ message: "usuario no autorizado" });
          break;
        default:
          resolve({ message: "estado de token desconocido" });
          break;
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      reject({ status: -1, user: null });
    }
  });
}

/**
 * Registrar usuario
 * Endpoint para registrar un nuevo usuario
 *
 * body Register_body 
 * returns inline_response_200_1
 **/


exports.registerPOST = function (body) {
  return new Promise(function (resolve, reject) {
    const user = register(body.name, body.pwd, function (status) {
      console.log(status)
      switch (status) {
        case 1:
          resolve("Usuario ya registrado");
          break;
        case -1:
          resolve("Datos incorrectos");
          break;
        case 2:
          resolve("Registrado con exito");
          break;
      }
    });
  });
}

