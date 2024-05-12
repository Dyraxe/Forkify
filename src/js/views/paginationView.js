import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = '';
  _message = '';

  _currPage = 1;
  _btnDisplayConfig = {
    right: {
      className: 'next',
      iconName: 'right',
      pageNumber: () => String(this._currPage + 1),
    },
    left: {
      className: 'prev',
      iconName: 'left',
      pageNumber: () => String(this._currPage - 1),
    },
  };

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(Number.parseInt(btn.dataset.goTo, 10));
    });
  }
  _generateMarkup() {
    const totalRes = this._data.results.length;
    this._currPage = this._data.currentPage;

    const { resultsPerPage: resPerPg } = this._data;

    const totalPages = Math.ceil(totalRes / resPerPg);
    // page 1 and there are other pages
    if (this._currPage === 1 && totalPages > 1) {
      return this._generateButton();
    }
    // page 1 and there are NO other pages
    if (this._currPage === 1 && totalPages <= resPerPg) {
      return '';
    }
    // last page
    if (this._currPage === totalPages && totalPages > 1) {
      return this._generateButton('left');
    }
    // other page
    if (this._currPage > 1 && this._currPage < totalPages) {
      return `
      ${this._generateButton('right')} ${this._generateButton('left')}
      `;
    }
  }

  _generateButton(pos = 'right') {
    const btnConfig = this._btnDisplayConfig[pos];
    const label = `<span>Page ${btnConfig.pageNumber()}</span>`;
    const icon = `<svg class="search__icon">
       <use href="${icons}#icon-arrow-${btnConfig.iconName}"></use> </svg>`;
    const content = pos === 'right' ? `${label}${icon}` : `${icon}${label}`;
    return `
      <button data-go-to="${btnConfig.pageNumber()}" class="btn--inline pagination__btn--${
      btnConfig.className
    }">
        ${content}
      </button> 
      `;
  }
}

export default new PaginationView();
