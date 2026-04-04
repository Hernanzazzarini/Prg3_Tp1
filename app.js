// app.js
import fetch from 'node-fetch';
import fs from 'fs/promises';
//Items 1)a
async function obtenerPersonajes() {
  try {
    const res = await fetch('https://thronesapi.com/api/v2/Characters');
    const data = await res.json();
    console.log(`Total de personajes: ${data.length}`);
    console.log("✔ Lista de personajes:");

    data.forEach(p => {
      console.log(`ID: ${p.id} | Nombre: ${p.fullName}`);
    });

    return data;

  } catch (error) {
    console.error(" Error al obtener personajes:", error);
  }
}
//Items 1)b
async function agregarPersonajeAPI() {
  try {
    const nuevoPersonaje = {
      fullName: "Hernan Zazzarini",
      title: "Developer de Villa Reduccion(cba)",
      family: "Grupo BF",
      imageUrl: ""
    };

    const res = await fetch('https://thronesapi.com/api/v2/Characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoPersonaje)
    });

    console.log("Se agrega nuevo personaje mediante POST");
    console.log(" Datos enviados:", nuevoPersonaje);

    if (res.status === 204) {
      console.log(" La API no devuelve contenido,Solo se muestra por consola");
      return;
    }

    const text = await res.text();
    if (text) {
      const data = JSON.parse(text);
      console.log(" Respuesta:", data);
    } else {
      console.log("NOTA: La API no guarda datos, solo se muestra por consola");
    }

  } catch (error) {
    console.error(" Error en POST:", error);
  }
}
//Items 1)c
async function buscarPorId(id) {
  try {
    if (id === undefined || id === null) {
      throw new Error("ID inválido");
    }

    const res = await fetch(`https://thronesapi.com/api/v2/Characters/${id}`);
    if (!res.ok) throw new Error(`Personaje con ID ${id} no encontrado`);

    const personaje = await res.json();

    console.log(`Personaje encontrado (ID: ${id}):`);
    console.log(`Nombre: ${personaje.fullName}`);
    console.log(`Título: ${personaje.title}`);
    console.log(`Familia: ${personaje.family}`);
    console.log(`Imagen: ${personaje.imageUrl}`);

  } catch (error) {
    console.error(" Error:", error.message);
  }
}
//Items 1)d
async function guardarPersonajes(personajes) {
  try {
    await fs.writeFile('personajes.json', JSON.stringify(personajes, null, 2), 'utf-8');
    console.log("Items 1)d. Datos guardados correctamente en personajes.json");
  } catch (error) {
    console.error(" Error al guardar archivo:", error);
  }
}

// ===============================
// Items 2) - Métodos comunes y avanzados – File System
// ===============================

//Items 2)a
async function agregarPersonajeAlFinal() {
  try {
    const contenido = await fs.readFile('personajes.json', 'utf-8');
    const personajes = JSON.parse(contenido);

    const nuevoPersonaje = {
      id: 9999,
      fullName: "Personaje Final",
      title: "El Último",
      family: "Sin Familia",
      imageUrl: ""
    };

    personajes.push(nuevoPersonaje);
    await fs.writeFile('personajes.json', JSON.stringify(personajes, null, 2), 'utf-8');
    console.log("Items 2)a. Personaje agregado al final:", nuevoPersonaje);
  } catch (error) {
    console.error(" Error en 2)a:", error);
  }
}

//Items 2)b
async function agregarPersonajesAlInicio() {
  try {
    const contenido = await fs.readFile('personajes.json', 'utf-8');
    const personajes = JSON.parse(contenido);

    const personaje1 = {
      id: 8001,
      fullName: "Primero Nuevo",
      title: "El Primero",
      family: "Casa Nueva",
      imageUrl: ""
    };
    const personaje2 = {
      id: 8002,
      fullName: "Segundo Nuevo",
      title: "El Segundo",
      family: "Casa Nueva",
      imageUrl: ""
    };

    personajes.unshift(personaje1, personaje2);
    await fs.writeFile('personajes.json', JSON.stringify(personajes, null, 2), 'utf-8');
    console.log("Items 2)b. Dos personajes agregados al inicio:", personaje1.fullName, "y", personaje2.fullName);
  } catch (error) {
    console.error(" Error en 2)b:", error);
  }
}

//Items 2)c
async function eliminarPrimerPersonaje() {
  try {
    const contenido = await fs.readFile('personajes.json', 'utf-8');
    const personajes = JSON.parse(contenido);

    const eliminado = personajes.shift();
    await fs.writeFile('personajes.json', JSON.stringify(personajes, null, 2), 'utf-8');
    console.log("Items 2)c. Personaje eliminado:", eliminado);
  } catch (error) {
    console.error(" Error en 2)c:", error);
  }
}

//Items 2)d
async function crearArchivoIdNombres() {
  try {
    const contenido = await fs.readFile('personajes.json', 'utf-8');
    const personajes = JSON.parse(contenido);

    const idNombres = personajes.map(p => ({ id: p.id, fullName: p.fullName }));
    await fs.writeFile('personajes_id_nombres.json', JSON.stringify(idNombres, null, 2), 'utf-8');
    console.log("Items 2)d. Archivo 'personajes_id_nombres.json' creado con", idNombres.length, "personajes.");

    return idNombres;
  } catch (error) {
    console.error(" Error en 2)d:", error);
  }
}

//Items 2)e
async function ordenarPorNombreDecreciente(idNombres) {
  try {
    const ordenados = [...idNombres].sort((a, b) => b.fullName.localeCompare(a.fullName));
    console.log("Items 2)e. Personajes ordenados por nombre (decreciente):");
    ordenados.forEach(p => console.log(`  ID: ${p.id} | Nombre: ${p.fullName}`));
  } catch (error) {
    console.error(" Error en 2)e:", error);
  }
}

// ===============================
// MAIN LLAMA A LA FUNCION
// ===============================
async function main() {
  const personajes = await obtenerPersonajes();
  await agregarPersonajeAPI();
  await buscarPorId(52);
  await guardarPersonajes(personajes);

  await agregarPersonajeAlFinal();
  await agregarPersonajesAlInicio();
  await eliminarPrimerPersonaje();
  const idNombres = await crearArchivoIdNombres();
  await ordenarPorNombreDecreciente(idNombres);
}

main();