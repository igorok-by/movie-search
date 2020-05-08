import * as constants from './utils/constants';
import SearchApp from './components/SearchApp';
import Card from './components/Card';
import Input from './components/Input';

window.onload = () => {
  const card = new Card({
    name: 'Name of mov',
    linkForName: '###',
    linkOfPoster: 'N/A',
    yearOfRelease: 1984,
    ratingIMDb: 6.6,
  });

  const input = new Input();

  constants.main.append(input.formSearch, card.container);
  constants.body.append(constants.header, constants.main, constants.footer);
};
