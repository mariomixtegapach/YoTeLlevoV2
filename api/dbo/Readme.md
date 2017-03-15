Archivo que accesa a la base de datos de mongo

* * Uso * *
var Dbo = require("mi/locacion/dbo") <--- Escribe el path haciendo referencia a la carpeta que contiene el index.js


-- Valores por default y config

var config = {
    url : 'mongodb://localhost:27017/lunch',  //Mongodb uri al que se conectara 
}

var dbo = new Dbo(config);
