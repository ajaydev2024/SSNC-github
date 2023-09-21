module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "next",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    plugins: ['react', 'node'], 
    rules: {
        "react/no-unescaped-entities": "off",
        "@next/next/no-page-custom-font": "off"
        "node/no-template-curly-in-string": ["error", { "allowSimple": true }],
    },
    settings: {
        react: {
            version: 'detect'
        }
    },

}
