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
    this.totalPages = 1;
    this.currentIndex = 0;

    this.mainContainer = create('div', 'container container--column');
    this.swiperSupContainer = create('div', 'swiper-container--sup');
    this.swiperContainer = create('div', 'swiper-container');
    this.swiperSubContainer = create('div', 'swiper-wrapper');
    this.swiperBtnPrev = create('div', 'swiper-button-prev');
    this.swiperBtnNext = create('div', 'swiper-button-next');
    this.resultDescr = create('p', 'result');

    this.swiper = {};
    this.url = '';
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

    return dataFromIMDb.map((aboutFilm) => aboutFilm.imdbRating);
  }

  async getDataForCards() {
    this.form.loaderGIF.classList.add('search__loader--shown');

    const data = await this.getDataFromAPI(
      constants.urlSearchWord(this.currentWord, this.currentPage),
    );

    this.totalPages = Math.ceil(Number(data.totalResults) / constants.elementsInPage);

    return data;
  }

  async createArrayOfCards() {
    const arrayOfCards = [];

    const dataForCards = await this.getDataForCards();
    const ratings = await this.getArrayOfRatings(dataForCards);

    dataForCards.Search.forEach((dataOfCard, indexOfCard) => {
      const card = new Card({
        name: dataOfCard.Title,
        linkForName: constants.linkForName(dataOfCard.imdbID),
        linkOfPoster: dataOfCard.Poster,
        yearOfRelease: dataOfCard.Year,
        ratingIMDb: ratings[indexOfCard],
      });

      arrayOfCards.push(card.container);
    });

    return arrayOfCards;
  }

  async addCardsToSwiper() {
    const arrayOfCards = await this.createArrayOfCards();
    await this.swiper.appendSlide(arrayOfCards);
    this.form.loaderGIF.classList.remove('search__loader--shown');
  }

  addOneMorePage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.addCardsToSwiper();
    }
  }

  async doSearching(e) {
    e.preventDefault();
    if (this.form.input.value && this.form.input.value !== this.currentWord) {
      this.currentPage = 1;
      this.currentWord = this.form.input.value;
      this.swiper.removeAllSlides();
      await this.addCardsToSwiper();
      this.swiper.slideTo(0);

      this.addOneMorePage();
    }
  }

  resetCurrentWord() {
    this.currentWord = '';
  }

  handleAddMoreSlides() {
    if (this.currentIndex < this.swiper.activeIndex) this.currentIndex += 1;

    if (this.currentIndex % constants.elementsInPage === 1) {
      this.addOneMorePage();
    }
  }

  async renderSwiper() {
    const arrayOfCards = await this.createArrayOfCards();

    this.swiperSubContainer.append(...arrayOfCards);

    this.swiper = new Swiper(this.swiperContainer, {
      slidesPerView: 4,
      spaceBetween: 20,
      centerInsufficientSlides: true,
      watchOverflow: true,
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

  bindEventListeners() {
    this.form.formSearch.addEventListener('submit', (event) => this.doSearching(event));
    this.form.formSearch.addEventListener('reset', () => this.resetCurrentWord());
    this.swiper.on('slideChange', () => this.handleAddMoreSlides());
  }

  async init() {
    this.renderLayout();
    await this.renderSwiper();
    this.bindEventListeners();
    this.addOneMorePage();
  }
}
