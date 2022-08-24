export default {
  DATABASE_URL: 'https://rslang-team-52-alexiykami.herokuapp.com',
  MAX_DICTIONARY_PAGES: 29,
  MAX_DIFFICULTY_LEVEL: 5,
  WORDS_PER_PAGE: 20,
  COUNT_OF_WORDS: function () {
    return (this.MAX_DICTIONARY_PAGES + 1) * (this.MAX_DIFFICULTY_LEVEL + 1) * this.WORDS_PER_PAGE;
  },
};
