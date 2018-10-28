
module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/.jest.setup.js",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
};
