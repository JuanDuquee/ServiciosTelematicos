const Blockchain = require("./src/blockchain"); // Importamos la clase Blockchain desde su módulo
const Block = require("./src/block"); // Importamos la clase Block desde su módulo

async function run() { // Definimos una función asíncrona para ejecutar nuestro programa
  const blockchain = await new Blockchain(); // Creamos una nueva instancia de la cadena de bloques
  const block1 = new Block({ data: "Block #1" }); // Creamos el primer bloque con algunos datos
  await blockchain.addBlock(block1); // Agregamos el bloque a la cadena de bloques
  const block2 = new Block({ data: "Block #2" }); // Creamos el segundo bloque con algunos datos
  await blockchain.addBlock(block2); // Agregamos el bloque a la cadena de bloques
  const block3 = new Block({ data: "Block #3" }); // Creamos el tercer bloque con algunos datos
  await blockchain.addBlock(block3); // Agregamos el bloque a la cadena de bloques

  blockchain.print(); // Imprimimos todos los bloques en la cadena de bloques
}

run(); // Ejecutamos nuestra función asincrónica

