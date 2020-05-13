/* eslint-disable consistent-return */
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

    try {
      const res = await fetch(this.url);
      const data = await res.json();

      return data;
    } catch (err) {
      return err;
    }
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

    this.resultDescr.innerHTML = `There are ${data.totalResults} results for '${this.currentWord}'`;
    this.totalPages = Math.ceil(Number(data.totalResults) / constants.elementsInPage);

    return data;
  }

  async createArrayOfCards() {
    const arrayOfCards = [];

    try {
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
    } catch (err) {
      this.resultDescr.innerHTML = constants.apiIsExpiredSentence;
      return err;
    }
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
      const data = await this.getDataFromAPI(
        constants.urlSearchWord(this.form.input.value, this.currentPage),
      );

      if (!data.Error) {
        this.currentWord = this.form.input.value;
        this.currentPage = 1;
        this.swiper.removeAllSlides();
        await this.addCardsToSwiper();
        this.swiper.slideTo(0);

        this.addOneMorePage();
      }

      this.resultDescr.innerHTML = `No results were found for '${this.form.input.value}'`;
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
    try {
      const arrayOfCards = await this.createArrayOfCards();
      this.swiperSubContainer.append(...arrayOfCards);
      this.swiperSupContainer.append(this.swiperBtnNext, this.swiperBtnPrev);

      this.swiper = new Swiper(this.swiperContainer, {
        slidesPerView: 1,
        spaceBetween: 10,
        centerInsufficientSlides: true,
        watchOverflow: true,
        observer: true,

        navigation: {
          nextEl: this.swiperBtnNext,
          prevEl: this.swiperBtnPrev,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          800: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },
      });
      this.swiper.on('slideChange', () => this.handleAddMoreSlides());
    } catch (err) {
      this.resultDescr.innerHTML = constants.apiIsExpiredSentence;

      this.form.loaderGIF.classList.remove('search__loader--shown');
    }
  }

  renderLayout() {
    this.swiperContainer.append(this.swiperSubContainer);
    this.swiperSupContainer.append(this.swiperContainer);
    this.mainContainer.append(this.form.formSearch, this.resultDescr, this.swiperSupContainer);
    this.main.append(this.mainContainer);
    this.body.append(this.header, this.main, this.footer);
  }

  bindEventListeners() {
    this.form.formSearch.addEventListener('submit', (event) => this.doSearching(event));
    this.form.formSearch.addEventListener('reset', () => this.resetCurrentWord());
  }

  async init() {
    this.renderLayout();
    await this.renderSwiper();
    this.bindEventListeners();
    this.addOneMorePage();
  }
}
