import Swiper from 'swiper';
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
    this.currentWord = 'paradise';
    this.currentPage = 1;

    this.mainContainer = create('div', 'container container--column');
    this.swiperSupContainer = create('div', 'swiper-container--sup');
    this.swiperContainer = create('div', 'swiper-container');
    this.swiperSubContainer = create('div', 'swiper-wrapper');
    this.swiperBtnPrev = create('div', 'swiper-button-prev');
    this.swiperBtnNext = create('div', 'swiper-button-next');
    this.resultDescr = create('p', 'result');

    this.swiper = {};
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

  async createArrayOfCards() {
    const dataFromAPI = await this.getDataFromAPI(
      constants.urlSearchWord(this.currentWord, this.currentPage),
    );
    const ratings = await this.getArrayOfRatings(dataFromAPI);
    this.cards = [];

    dataFromAPI.Search.forEach((dataOfCard, indexOfCard) => {
      const card = new Card({
        name: dataOfCard.Title,
        linkForName: constants.linkForName(dataOfCard.imdbID),
        linkOfPoster: dataOfCard.Poster,
        yearOfRelease: dataOfCard.Year,
        ratingIMDb: ratings[indexOfCard],
      });

      this.cards.push(card.container);
    });

    return this.cards;
  }

  doSearching(e) {
    e.preventDefault();
    if (this.form.input.value && this.form.input.value !== this.currentWord) {
      this.currentPage = 1;
      this.currentWord = this.form.input.value;
      this.swiper.removeAllSlides();
      this.addCardsToSwiper();
    }
  }

  async addCardsToSwiper() {
    await this.createArrayOfCards();
    this.swiper.appendSlide(this.cards);
  }

  resetCurrentWord() {
    this.currentWord = '';
  }

  bindEventListeners() {
    this.form.formSearch.addEventListener('submit', (event) => this.doSearching(event));
    this.form.formSearch.addEventListener('reset', () => this.resetCurrentWord());
  }

  async renderSwiper() {
    await this.createArrayOfCards();

    this.swiperSubContainer.append(...this.cards);

    this.swiper = new Swiper(this.swiperContainer, {
      slidesPerView: 4,
      spaceBetween: 20,
      centerInsufficientSlides: true,
      watchOverflow: true,
      grabCursor: true,
      observer: true,

      navigation: {
        nextEl: this.swiperBtnNext,
        prevEl: this.swiperBtnPrev,
      },
    });
  }

  renderLayout() {
    this.swiperContainer.append(this.swiperSubContainer);
    this.swiperSupContainer.append(this.swiperContainer, this.swiperBtnNext, this.swiperBtnPrev);
    this.mainContainer.append(this.form.formSearch, this.resultDescr, this.swiperSupContainer);
    this.main.append(this.mainContainer);
    this.body.append(this.header, this.main, this.footer);
  }

  init() {
    this.renderLayout();
    this.renderSwiper();
    this.bindEventListeners();
  }
}
