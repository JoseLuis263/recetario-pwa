let form, list;

window.addEventListener('DOMContentLoaded', async () => {
  form = document.getElementById('recipeForm');
  list = document.getElementById('recipeList');
  searchInput.addEventListener('input', filterRecipes);


  await openDB();
  loadRecipes();

  form.addEventListener('submit', saveRecipe);
});

// Guardar o actualizar
async function saveRecipe(e) {
  e.preventDefault();

  const id = document.getElementById('recipeId').value;

  const recipe = {
    nombre: nombre.value,
    ingredientes: ingredientes.value,
    pasos: pasos.value,
    categoria: categoria.value,
    imagen: imagen.value
  };

  if (id) {
    recipe.id = Number(id);
    await updateRecipe(recipe);
  } else {
    await addRecipe(recipe);
  }

  form.reset();
  document.getElementById('recipeId').value = '';

  loadRecipes();
}

// Mostrar recetas
async function loadRecipes() {
  
  const recipes = await getAllRecipes();
  list.innerHTML = '';

  recipes.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${r.nombre}</strong> (${r.categoria})
      <button onclick="viewRecipe(${r.id})">👁️</button>
      <button onclick="editRecipe(${r.id})">✏️</button>
      <button onclick="removeRecipe(${r.id})">❌</button>
    `;
    list.appendChild(li);
  });
  renderList(recipes);

}

// Editar
async function editRecipe(id) {
  const recipes = await getAllRecipes();
  const recipe = recipes.find(r => r.id === id);

  recipeId.value = recipe.id;
  nombre.value = recipe.nombre;
  ingredientes.value = recipe.ingredientes;
  pasos.value = recipe.pasos;
  categoria.value = recipe.categoria;
  imagen.value = recipe.imagen;
}

// Eliminar
async function removeRecipe(id) {
  if (confirm('¿Eliminar receta?')) {
    await deleteRecipe(id);
    loadRecipes();
  }
}

async function viewRecipe(id) {
  const recipes = await getAllRecipes();
  const r = recipes.find(r => r.id === id);

  detailTitle.textContent = r.nombre;
  detailCategory.textContent = r.categoria;
  detailIngredients.textContent = r.ingredientes;
  detailSteps.textContent = r.pasos;

  if (r.imagen) {
    detailImage.src = r.imagen;
    detailImage.style.display = 'block';
  } else {
    detailImage.style.display = 'none';
  }

  recipeDetail.hidden = false;
}

function closeDetail() {
  recipeDetail.hidden = true;
}

async function filterRecipes() {
  const text = searchInput.value.toLowerCase();
  const recipes = await getAllRecipes();

  const filtered = recipes.filter(r =>
    r.nombre.toLowerCase().includes(text) ||
    r.ingredientes.toLowerCase().includes(text)
  );

  renderList(filtered);
}

function renderList(recipes) {
  list.innerHTML = '';

  recipes.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${r.nombre}</strong> (${r.categoria})
      <button onclick="viewRecipe(${r.id})">👁️</button>
      <button onclick="editRecipe(${r.id})">✏️</button>
      <button onclick="removeRecipe(${r.id})">❌</button>
    `;
    list.appendChild(li);
  });
}
