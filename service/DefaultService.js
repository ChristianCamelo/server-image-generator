// 'use strict';



// /**
//  * Iniciar sesión
//  * Endpoint para iniciar sesión de usuario
//  *
//  * body Login_body 
//  * returns inline_response_200
//  **/

// const checkPwd = require('./Password')
// const register = require('./Register');
// const { GetDiscordChannelMessages, PostDiscordImagine, PostInteraction } = require('./Discord');
// const { verificarToken, buildPrompt } = require('./Authorization')

// exports.loginPOST = function (body) {
//   return new Promise(function (resolve, reject) {
//     checkPwd(body.name, body.pwd, function (status, token) {
//       if (status === 2) {
//         resolve({ status: 200, message: "USER_CORRECT", token: token });
//       } else if (status === -1) {
//         reject({ status: 201, message: "USER_NOT_EXIST" });
//       } else if (status === 1) {
//         reject({ status: 202, message: "USER_INCORRECT" });
//       } else {
//         reject(new Error("Error desconocido al iniciar sesión"));
//       }
//     });
//   });
// };

// /**
//  * Obtener mensajes
//  * Endpoint para obtener mensajes
//  *
//  * returns inline_response_200_2
//  **/

// exports.messagesGET = function (req) {
//   console.log("##################-MESSAGES GET-##################")
//   //console.log(req.headers.authorization)
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { status, channel } = await new Promise((resolve, reject) => {
//         verificarToken(req.headers.authorization, (status, channel) => {
//           resolve({ status, channel });
//         });
//       });
//       //console.log(req.headers.authorization)
//       switch (status.status) {
//         case 1:
//           const messages = await GetDiscordChannelMessages(status.channel);
//           resolve({ message: messages });
//           break;
//         case -1:
//           resolve({ message: "usuario no autorizado" });
//           break;
//         default:
//           resolve({ message: "estado de token desconocido" });
//           break;
//       }
//     } catch (error) {
//       console.error('Error al verificar el token:', error);
//       reject({ status: -1, user: null });
//     }
//   });
// };


// /**
//  * Crear mensaje
//  * Endpoint para crear un nuevo mensaje
//  *
//  * body Messages_body 
//  * returns inline_response_200_3
//  **/
// exports.messagesPOST = function (req, body) {
//   console.log("##################-MESSAGES POST INIT-##################")
//   return new Promise(async (resolve, reject) => {
//     try {
//       //console.log(body)
//       const { status, channel } = await new Promise((resolve, reject) => {
//         verificarToken(req.headers.authorization, (status) => {
//           resolve({ status });
//           console.log("messagesPOST: user: ", status.user.username)
//         });
//       });
//       //console.log("messagesPOST recibe: ", body, " channel: ", status.channel)
//       switch (status.status) {
//         case 1:
//           try {
//             const resultado = await buildPrompt(status.user.username, body);
//             await PostDiscordImagine(resultado, status.channel);
//             resolve({ message: "usuario autorizado" });
//             console.log("##################-MESSAGES POST CLOSE-##################")
//           } catch (error) {
//             console.error('Error en la solicitud de Discord o al construir el prompt:', error);
//             console.log("##################-MESSAGES POST CLOSE-##################")
//           }
//           break;
//         case -1:
//           resolve({ message: "usuario no autorizado" });
//           console.log("##################-MESSAGES POST CLOSE-##################")
//           break;
//         default:
//           resolve({ message: "estado de token desconocido" });
//           console.log("##################-MESSAGES POST CLOSE-##################")
//           break;
//       }
//     } catch (error) {
//       console.error('Error al verificar el token:', error);
//       console.log("##################-MESSAGES POST CLOSE-##################")
//       reject({ status: -1, user: null });
//     }
//   });
// }


// /**
//  * Crear accion
//  * Endpoint para crear un nuevo accion
//  *
//  * body Messages_body 
//  * returns inline_response_200_3
//  **/
// exports.actionPOST = function (req, body) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { status, channel } = await new Promise((resolve, reject) => {
//         verificarToken(req.headers.authorization, (status, channel) => {
//           resolve({ status, channel });
//         });
//       });
//       console.log(req)
//       //console.log(status)
//       switch (status.status) {
//         case 1:
//           console.log(body)
//           //const messages = await PostInteraction(body);
//           resolve({ message: "recibida accion" });
//           break;
//         case -1:
//           resolve({ message: "usuario no autorizado" });
//           break;
//         default:
//           resolve({ message: "estado de token desconocido" });
//           break;
//       }
//     } catch (error) {
//       console.error('Error al verificar el token:', error);
//       reject({ status: -1, user: null });
//     }
//   });
// }

// /**
//  * Registrar usuario
//  * Endpoint para registrar un nuevo usuario
//  *
//  * body Register_body 
//  * returns inline_response_200_1
//  **/


// exports.registerPOST = function (req, body) {
//   console.log("##################-REGISTER POST INIT-##################")
//   return new Promise(async (resolve, reject) => {
//     try {

//       const { status, channel } = await new Promise((resolve, reject) => {
//         verificarToken(req.headers.authorization, (status) => {
//           resolve({ status });
//           console.log("registerPOST: user: ", status)
//         });
//       });

//       // SI STATUS DEVUELVE 3 es administrador
//       if(status.status === 3){
//         console.log("registerPOST: registrando a ",body);
//         const result = await new Promise((resolve,reject)=>{
//           register(body,(res)=>{
//             console.log("registerPost: desde register: ",res)
//             resolve(res);
//           })
//         })
//         switch (result) {
//           case 1:
//             console.log(body)
//             //const messages = await PostInteraction(body);
//             resolve({ message: "usuario ya existe" });
//             break;
//           case -1:
//             resolve({ message: "usuario imposible de generar" });
//             break;
//           case 2:
//               resolve({ message: "usuario almacenado" });
//               break;
//           default:
//             resolve({ message: "estado de token desconocido" });
//             break;
//         }
//       }
//       else{
//             resolve({ message: "usuario no autorizado" });
//             console.log("##################-REGISTER POST CLOSE-##################")
//       }

//       console.log("##################-REGISTER POST END-##################");
//     } catch (err) {
//       console.error("Error en el registro:", err);
//       reject("Error en el registro");
//     }
//   });
// }
'use strict';

const checkPwd = require('./Password');
const register = require('./Register');
const { GetDiscordChannelMessages, PostDiscordImagine, PostInteraction } = require('./Discord');
const { verificarToken, buildPrompt } = require('./Authorization');

exports.loginPOST = function (body) {
  return new Promise(function (resolve, reject) {
    checkPwd(body.name, body.pwd, function (status, token) {
      if (status === 2) {
        resolve({ status: 200, message: "USER_CORRECT", token: token });
      } else if (status === -1) {
        reject({ status: 201, message: "USER_NOT_EXIST" });
      } else if (status === 1) {
        reject({ status: 202, message: "USER_INCORRECT" });
      } else {
        reject({ status: 500, message: "INTERNAL_ERROR" });
      }
    });
  });
};

exports.messagesGET = function (req) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await verificarToken(req.headers.authorization);
      switch (response.status) {
        case 1:
          const messages = await GetDiscordChannelMessages(response.channel);
          resolve({ status: 200, message: messages });
          break;
        case 3:
          resolve({ status: 201, message: "ADMIN_HAS_NO_CHANNEL" });
          break;
        case -1:
          resolve({ status: 401, message: "USER_NOT_AUTHORIZED" });
          break;
        case -2:
          resolve({ status: 406, message: "USER_NOT_AUTHORIZED" });
          break;
        default:
          resolve({ status: 500, message: "UNKNOWN_TOKEN_STATE" });
          break;
      }
    } catch (error) {
      reject({ status: 500, message: "TOKEN_ERROR" });
    }
  });
};

exports.messagesPOST = function (req, body) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await verificarToken(req.headers.authorization);
      switch (response.status) {
        case 1:
          try {
            const resultado = await buildPrompt(response.user.username, body);
            await PostDiscordImagine(resultado, response.channel);
            resolve({ status: 200, message: "USER_AUTHORIZED" });
          } catch (error) {
            reject({ status: 500, message: "INTERNAL_ERROR" });
          }
          break;
        case -1:
          resolve({ status: 401, message: "USER_NOT_AUTHORIZED" });
          break;
        default:
          resolve({ status: 500, message: "UNKNOWN_TOKEN_ERROR" });
          break;
      }
    } catch (error) {
      reject({ status: 500, message: "TOKEN_ERROR" });
    }
  });
};

exports.actionPOST = function (req, body) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await verificarToken(req.headers.authorization);
      switch (response.status) {
        case 1:
          resolve({ status: 200, message: "ACTION_DONE" });
          break;
        case -1:
          resolve({ status: 401, message: "USER_NOT_AUTHORIZED" });
          break;
        default:
          resolve({ status: 500, message: "UNKNOWN_TOKEN_ERROR" });
          break;
      }
    } catch (error) {
      reject({ status: 500, message: "TOKEN_ERROR" });
    }
  });
};

exports.registerPOST = function (req, body) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await verificarToken(req.headers.authorization);
      if (response.status === 3) {
        const result = await new Promise((resolve, reject) => {
          register(body, (res) => {
            resolve(res);
          });
        });
        switch (result) {
          case 1:
            resolve({ status: 409, message: "USER_ALREADY_EXIST" });
            break;
          case -1:
            resolve({ status: 500, message: "BAD_USER_DATA" });
            break;
          case 2:
            resolve({ status: 201, message: "USER_CREATED" });
            break;
          default:
            resolve({ status: 500, message: "UNKNOWN_TOKEN_ERROR" });
            break;
        }
      } else {
        resolve({ status: 401, message: "USER_NOT_AUTHORIZED" });
      }
    } catch (error) {
      reject({ status: 500, message: "TOKEN_ERROR" });
    }
  });
};
