import create from '../utils/create';

export default class Card {
  constructor({
    name, linkForName, linkOfPoster, yearOfRelease, ratingIMDb,
  }) {
    this.name = create('a', 'card__name', `${name}`, null, ['href', linkForName], ['target', 'blank']);
    this.defaultPoster = '/assets/img/no-image-icon.png';
    this.linkOfPoster = linkOfPoster === 'N/A' ? this.defaultPoster : linkOfPoster;
    this.poster = create('img', 'card__img', null, null, ['src', this.linkOfPoster], ['alt', `The movie titled: ${name}`]);
    this.yearOfRelease = create('p', 'card__date', `${yearOfRelease}`, null);
    this.rating = create('p', 'card__date card__date--stars', `${ratingIMDb}`);
    this.cardFooter = create('div', 'card__footer', [this.yearOfRelease, this.rating]);
    this.subContainer = create('div', 'card', [this.name, this.poster, this.cardFooter]);
    this.container = create('div', 'swiper-slide', this.subContainer, null);
  }
}
