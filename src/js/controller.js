if (module.hot) {
  module.hot.accept();
}

//https://github.com/jonasschmedtmann/complete-javascript-course/commit/fefcc4cb12572b33176a2d88377af528fc592610

import { displayCurrentTime } from './helpers/time';

import { async } from 'regenerator-runtime';

import * as model from './model';

import resultsView from './views/resultsView';
import recipeView from './views/recipeView';
import bookmarksView from './views/bookmarksView';
import searchView from './views/searchView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

////////////////////////////////

const controlRecipes = async function () {
  // handle recipes
  const id = window.location.hash.slice(1);
  if (!id) return;
  try {
    recipeView.renderSpinner();

    // update results view to mark selected search results
    resultsView.update(model.getSearchResultsPages());

    bookmarksView.update(model.state.bookmarks);

    // gets recipe = model
    await model.loadRecipe(id);

    //  render recipe = view
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.loadResults(query);

    resultsView.render(model.getSearchResultsPages(1));

    // const mockSearch = {
    //   results: Array.from({ length: 5 }, (_, i) => i),
    //   currentPage: 1,
    //   resultsPerPage: 10,
    // };
    // paginationView.render(mockSearch);
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error.message);
  }
};
const controlPagination = function (goTo) {
  // getSearchResultsPages will internally update the current page
  //
  resultsView.render(model.getSearchResultsPages(goTo));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  //  Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // hmm
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};
function init() {
  window.addEventListener('load', displayCurrentTime);

  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
}
init();
