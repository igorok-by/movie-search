import * as constants from '../utils/constants';
import create from '../utils/create';
import Card from './Card';
import Input from './Input';

export default class SearchApp {
  constructor() {
    this.header = constants.header;
    this.main = constants.main;
    this.footer = constants.footer;
    this.body = document.body;

    this.form = new Input();
    this.inputValue = 'dream';

    this.mainContainer = create('div', 'container container--column');
    this.swiperContainer = create('div', 'card-container');
    this.swiper = create('div', 'card-row');
    this.resultDescr = create('p', 'result');
    this.url = '';
    this.cards = [];
  }

  async getDataFromAPI(url) {
    this.url = url;

    const res = await fetch(this.url);
    const data = await res.json();
    return data;
  }

  async getArrayOfRatings(data) {
    const arrayOfIDs = data.Search.map(
      (dataOfCard) => this.getDataFromAPI(constants.urlIMDbRating(dataOfCard.imdbID)),
    );
    const dataFromIMDb = await Promise.all(arrayOfIDs);

    return dataFromIMDb.map((aboutFilm) => aboutFilm.Ratings[0].Value);
  }

  async createArrayOfCards(data) {
    const ratings = await this.getArrayOfRatings(data);

    data.Search.map((dataOfCard, indexOfCard) => {
      const card = new Card({
        name: dataOfCard.Title,
        linkForName: constants.linkForName(dataOfCard.imdbID),
        linkOfPoster: dataOfCard.Poster,
        yearOfRelease: dataOfCard.Year,
        ratingIMDb: ratings[indexOfCard],
      });
      this.cards.push(card.container);
      return this.cards;
    });

    return this.cards;
  }

  async renderCards(page) {
    const dataFromAPI = await this.getDataFromAPI(constants.urlSearchWord(this.inputValue, page));

    await this.createArrayOfCards(dataFromAPI);

    this.swiper.append(...this.cards);
    this.swiperContainer.append(this.swiper);
    this.mainContainer.append(this.form.formSearch, this.resultDescr, this.swiperContainer);
    this.main.append(this.mainContainer);
    this.body.append(this.header, this.main, this.footer);
  }


  init() {
    this.renderCards(2);
  }
}
