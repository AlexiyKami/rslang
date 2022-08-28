export default {
  DATABASE_URL: 'https://rslang-team-52-alexiykami.herokuapp.com',
  MAX_DICTIONARY_PAGES: 29,
  MAX_DIFFICULTY_LEVEL: 5,
  WORDS_PER_PAGE: 20,
  COUNT_OF_WORDS: function () {
    return (this.MAX_DICTIONARY_PAGES + 1) * (this.MAX_DIFFICULTY_LEVEL + 1) * this.WORDS_PER_PAGE;
  },
  WRONG_SOUND_LINK: 'https://rslang-team15-natein.netlify.app/static/media/wrong.8e2ad3b1.mp3',
  RIGHT_SOUND_LINK: 'https://rslang-team15-natein.netlify.app/static/media/correct.a7b1cde9.mp3',
  END_GAME_LINK: 'https://ulearning-69team.netlify.app/assets/sounds/complete.mp3',
};
