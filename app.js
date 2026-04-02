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
// MAIN LLAMA A LA FUNCION
// ===============================
async function main() {
  const personajes = await obtenerPersonajes();
  await agregarPersonajeAPI();
  await buscarPorId(52);
  await guardarPersonajes(personajes);
}

main();