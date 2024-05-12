import View from './View';

class SearchView extends View {
  _parentElement = document.querySelector('.search');
  _input = this._parentElement.querySelector('.search__field');

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._input.value;
    this.#clearField();
    return query;
  }

  #clearField() {
    this._input.value = '';
  }
}

export default new SearchView();
