var js = require("@eslint/js");

module.exports = [
    js.configs.recommended,

    {
        rules: {
            "no-unused-vars": "off",
            "no-undef": "warn"
        },
        
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script"
        }
    }
];
