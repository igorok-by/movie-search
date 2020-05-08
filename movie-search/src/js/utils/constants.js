import create from './create';

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

export const { body } = document;
