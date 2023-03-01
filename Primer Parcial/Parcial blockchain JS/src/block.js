// Importamos la librería SHA256 para calcular hashes y la librería hex2ascii para decodificar datos en formato hexadecimal
const SHA256 = require("crypto-js/sha256");
const hex2ascii = require("hex2ascii");

// Definición de la clase Block
class Block {
  // Constructor del bloque
  constructor(data) {
    this.hash = null; // Hash del bloque
    this.height = 0; // Altura del bloque (posición en la cadena)
    this.body = Buffer.from(JSON.stringify(data).toString("hex")); // Cuerpo del bloque, convertido a formato hexadecimal
    this.time = 0; // Tiempo en el que se creó el bloque
    this.previousBlockHash = null; // Hash del bloque anterior
  }

  // Función para validar la integridad del bloque
  validate() {
    const self = this; // Guardamos una referencia al objeto actual (el bloque)

    // Creamos una nueva promesa que resuelve o rechaza según la validación del bloque
    return new Promise((resolve, reject) => {
      let currentHash = self.hash; // Guardamos el hash actual del bloque

      // Calculamos el hash del bloque sin el hash actual (para validar que el hash es correcto)
      self.hash = SHA256(JSON.stringify({ ...self, hash: null })).toString();

      // Comparamos el hash actual con el hash recalculado (si son iguales, el bloque es válido)
      if (currentHash !== self.hash) {
        return resolve(false);
      }

      resolve(true); // Resolvemos la promesa indicando que el bloque es válido
    });
  }

  // Función para obtener los datos almacenados en el bloque
  getBlockData() {
    const self = this; // Guardamos una referencia al objeto actual (el bloque)

    // Creamos una nueva promesa que resuelve o rechaza según la obtención de los datos del bloque
    return new Promise((resolve, reject) => {
      let encodedData = self.body; // Guardamos los datos del bloque en formato hexadecimal
      let decodedData = hex2ascii(encodedData); // Decodificamos los datos del bloque
      let dataObject = JSON.parse(decodedData); // Convertimos los datos en un objeto JSON

      // Si los datos son el bloque génesis, rechazamos la promesa
      if (dataObject === "Genesis Block") {
        reject(new Error("This is the Genesis Block"));
      }

      resolve(dataObject); // Resolvemos la promesa devolviendo los datos del bloque
    });
  }

  // Función para convertir el bloque en una cadena de texto
  toString() {
    const { hash, height, body, time, previousBlockHash } = this; // Desestructuramos las propiedades del bloque
    return `Block -
        hash: ${hash}
        height: ${height}
        body: ${body}
        time: ${time}
        previousBlockHash: ${previousBlockHash}
        -------------------------------------`; // Devolvemos una cadena de texto con los valores de las propiedades
  }
}

// Exportamos la clase Block para poder utilizarla en otros archivos
module.exports = Block;
