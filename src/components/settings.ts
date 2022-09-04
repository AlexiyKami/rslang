export default {
  DATABASE_URL: 'https://rslang-team-52-alexiykami.herokuapp.com',
  MAX_DICTIONARY_PAGES: 29,
  MAX_DIFFICULTY_LEVEL: 5,
  WORDS_PER_PAGE: 20,
  COUNT_OF_WORDS: function () {
    return (this.MAX_DICTIONARY_PAGES + 1) * (this.MAX_DIFFICULTY_LEVEL + 1) * this.WORDS_PER_PAGE;
  },
  WRONG_SOUND_LINK: './assets/sounds/wrong.mp3',
  RIGHT_SOUND_LINK: './assets/sounds/correct.mp3',
  END_GAME_LINK: './assets/sounds/end.mp3',
};
