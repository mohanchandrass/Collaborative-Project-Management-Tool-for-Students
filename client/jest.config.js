module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "jest-transform-stub",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!react-dnd|react-dnd-html5-backend|dnd-core)/"
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
};
