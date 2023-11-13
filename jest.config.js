module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transformIgnorePatterns: [
        "node_modules/(?!(dependency-using-non-standard-syntax)/)"
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
};
