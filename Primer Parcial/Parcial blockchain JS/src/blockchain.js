const SHA256 = require("crypto-js/sha256"); // Importamos la función SHA256 de la librería crypto-js para usarla en la generación de hashes
const Block = require("./block"); // Importamos la clase Block que definimos anteriormente

class Blockchain {
  constructor() {
    this.chain = []; // La cadena de bloques es un array que almacenará cada uno de los bloques de la blockchain
    this.height = -1; // La altura de la blockchain se inicializa en -1 porque todavía no hemos añadido ningún bloque
    this.initializeChain(); // Inicializamos la cadena de bloques
  }

  async initializeChain() {
    if (this.height === -1) { // Si la altura de la cadena es -1, significa que la cadena está vacía y necesitamos crear el bloque génesis
      const block = new Block({ data: "Genesis Block" }); // Creamos un nuevo bloque génesis con un objeto que contiene el texto "Genesis Block"
      await this.addBlock(block); // Añadimos el bloque génesis a la cadena
    }
  }

  addBlock(block) { // Método para añadir un bloque a la cadena
    let self = this; // Creamos una referencia a la instancia de la clase Blockchain
    return new Promise(async (resolve, reject) => { // Devolvemos una promesa que se resuelve o se rechaza dependiendo del resultado de la operación
      block.height = self.chain.length; // La altura del bloque se establece en la longitud actual de la cadena
      block.time = new Date().getTime().toString(); // La marca de tiempo del bloque se establece en el momento actual en formato de cadena

      if (self.chain.length > 0) { // Si la cadena tiene al menos un bloque, el bloque anterior es el último bloque añadido
        block.previousBlockHash = self.chain[self.chain.length - 1].hash; // Establecemos el hash del bloque anterior en el atributo previousBlockHash del nuevo bloque
      }

      let errors = await self.validateChain(); // Validamos la cadena antes de añadir el nuevo bloque
      if (errors.length > 0) { // Si hay errores en la cadena, rechazamos la promesa
        reject(new Error("The chain is not valid: ", errors));
      }

      block.hash = SHA256(JSON.stringify(block)).toString(); // Calculamos el hash del bloque concatenando sus atributos y aplicando la función SHA256
      self.chain.push(block); // Añadimos el bloque a la cadena
      resolve(block); // Resolvemos la promesa con el bloque añadido
    });
  }

  validateChain() { // Método para validar la cadena de bloques
    let self = this; // Creamos una referencia a la instancia de la clase Blockchain
    const errors = []; // Inicializamos un array para almacenar los errores de validación

    return new Promise(async (resolve, reject) => { // Devolvemos una promesa que se resuelve o se rechaza dependiendo del resultado de la operación
      self.chain.map(async (block) => { // Recorremos la cadena de bloques y validamos cada bloque
        try {
          let isValid = await block.validate(); // Validamos el bloque actual y esperamos a que se resuelva la promesa
          if (!isValid) { // Si el bloque no es valido:
            errors.push(new Error(`The block ${block.height} is not valid`)); // Agrega un mensaje de error a la lista de errores
          }
        } catch (err) {
          errors.push(err); // Si hay un error, agrega el error a la lista de errores
        }
      });

      resolve(errors); // Resuelve la promesa y devuelve la lista de errores
    });
  }

  print() {
    let self = this;
    for (let block of self.chain) { // Para cada bloque en la cadena de bloques
      console.log(block.toString()); // Muestra el bloque en la consola
    }
  }
}

module.exports = Blockchain; // exporta la clase Blockchain para su uso en otros archivos

