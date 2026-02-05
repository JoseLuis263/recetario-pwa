const DB_NAME = 'RecetarioDB';
const DB_VERSION = 1;
const STORE_NAME = 'recetas';

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Error al abrir la BD');

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = e => {
      const database = e.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });

        store.createIndex('nombre', 'nombre', { unique: false });
        store.createIndex('ingredientes', 'ingredientes', { unique: false });
      }
    };
  });
}

function addRecipe(recipe) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const request = store.add(recipe);

    request.onsuccess = () => resolve('Receta agregada');
    request.onerror = () => reject('Error al agregar');
  });
}

function getAllRecipes() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error al leer recetas');
  });
}

function updateRecipe(recipe) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const request = store.put(recipe);

    request.onsuccess = () => resolve('Receta actualizada');
    request.onerror = () => reject('Error al actualizar');
  });
}

function deleteRecipe(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => resolve('Receta eliminada');
    request.onerror = () => reject('Error al eliminar');
  });
}
