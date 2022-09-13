module.exports = {
    parser: 'babel-eslint',
    extends: ['standard'],
    env: {
        browser: true,
        node: true
    },
    rules: {
        indent: ['error', 4],
        'no-unused-vars': 0
    }
}
