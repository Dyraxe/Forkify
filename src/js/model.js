import { objCamelKeys } from './helpers/objects';
import { AJAX } from './helpers/http';
import { API_KEY, RES_PER_PAGE } from './config';

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};
export const loadRecipe = async function (id) {
  try {
    const {
      data: { recipe },
    } = await AJAX(`${id}?key=${API_KEY}`);

    state.recipe = objCamelKeys(recipe);
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadResults = async function (query) {
  try {
    state.search.query = query;
    const {
      data: { recipes },
    } = await AJAX(`?search=${state.search.query}&key=${API_KEY}`);

    if (recipes.length === 0)
      throw new Error(
        `No results were found for "${state.search.query}", Please try again with a different term!`
      );
    state.search.results = recipes.map(rec => objCamelKeys(rec));
    state.search.currentPage = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPages = function (
  page = state.search.currentPage
) {
  state.search.currentPage = page;
  const { resultsPerPage, currentPage } = state.search;
  /* 
    Multiplied by the amount of results I want to be displayed
   page 1
   1 - 1 = 0 * 10 = 0

   page 2
   2 - 1 = 1 * 10 = 10

   end 1 * 10 = 10 | 0 -> 9
   end 2 * 10 = 20 | 10 -> 19
   since slice does not include the last 10 becomes 9
   */
  const start = (currentPage - 1) * resultsPerPage; // 0
  const end = currentPage * resultsPerPage; // 9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    /*
     newQt = oldQt * newServing / oldServing
     2 * 8 / 4
     if we double the servings then we also need to double
     the quantity (of ingredients) 
     and multiply the original quantity by ratio of the new
     serving
    */
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // update at the end to preserve the original value for the calc
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(book => {
    return book.id === id;
  });
  if (index < 0) return;
  // Add bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && !!entry[1])
      .map(ing => {
        const ingArr = ing[1]
          // .replaceAll(' ', '')
          .split(',')
          .map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Incorrect ingredient format');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      ingredients,
    };
    const { data } = await AJAX(`?key=${API_KEY}`, recipe);
    state.recipe = data.recipe;
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.removeItem('bookmarks');
  state.bookmarks = [];
};

// clearBookmarks();
