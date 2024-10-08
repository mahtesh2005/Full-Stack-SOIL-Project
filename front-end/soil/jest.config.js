module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios).+\\.js$"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "jest-css-modules"
  },
  // Add the following moduleDirectories property
  moduleDirectories: ['node_modules', 'src'],
};
