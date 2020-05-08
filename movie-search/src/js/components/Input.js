import create from '../utils/create';

export default class Input {
  constructor() {
    this.input = create('input', 'search__input', null, null, ['type', 'text'], ['autocomplete', 'off'], ['spellcheck', 'false'], ['placeholder', 'Search movie'], ['autofocus', true]);

    this.submitBtn = create('button', 'search__submit', 'Go!', null, ['type', 'submit']);

    this.resetBtn = create('button', 'search__reset', '<svg><use xlink:href="./assets/img/sprite.svg#icon-close"></use></svg>', null, ['type', 'reset']);

    this.formSearch = create('form', 'search', [this.input, this.submitBtn, this.resetBtn], null, ['action', '/']);

    this.formSearch.insertAdjacentHTML('beforeend', '<svg class="search__input-icon"><use xlink:href="./assets/img/sprite.svg#icon-search"></use></svg>');
  }
}
