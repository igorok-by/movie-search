import create from '../utils/create';

export default class Card {
  constructor({
    name, linkForName, linkOfPoster, yearOfRelease, ratingIMDb,
  }) {
    this.name = create('a', 'card__name', `${name}`, null, ['href', linkForName], ['target', 'blank']);
    this.defaultPoster = 'https://images.unsplash.com/photo-1582450723295-c55c32a53428?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80';
    this.linkOfPoster = linkOfPoster === 'N/A' ? this.defaultPoster : linkOfPoster;
    this.poster = create('img', 'card__img', null, null, ['src', this.linkOfPoster], ['alt', `The movie titled: ${name}`]);
    this.yearOfRelease = create('p', 'card__date', `${yearOfRelease}`, null);
    this.rating = create('p', 'card__date card__date--stars', `${ratingIMDb}`, null);
    this.container = create('div', 'card', [this.name, this.poster, this.yearOfRelease, this.rating], null);
  }
}
