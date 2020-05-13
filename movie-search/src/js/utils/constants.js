import create from './create';

const apiKey = '50fb5534';

export const elementsInPage = 10;

export const header = create('header', 'header', '<h1>MovieSearch</h1>', null);

export const footer = create('footer', 'footer',
  `<div class="container container--sp-between">
    <a href="https://rs.school/" class="footer__link" target="blank">RSS School 2020q1</a>
    <a href="https://github.com/igorok-by" class="footer__link footer__link--github" target="blank">
      <svg><use xlink:href="./assets/img/sprite.svg#icon-git"></use></svg>
    igorok-by</a>
  </div>`,
  null);

export const main = create('main');

export const linkForName = (id) => `https://www.imdb.com/title/${id}/videogallery/`;

export const urlSearchWord = (searchedWord, page) => `https://www.omdbapi.com/?s=${searchedWord}&page=${page}&apikey=${apiKey}`;

export const urlIMDbRating = (id) => `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;
