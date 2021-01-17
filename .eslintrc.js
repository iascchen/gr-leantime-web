module.exports = {
    root: true,
    plugins: [
        'react', 'react-hooks', 'eslint-comments', 'graphql'
    ],
    extends: [
        'react-app',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType:  'module',  // Allows for the use of imports
    },
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/display-name': 'warn',
        'jsx-quotes': ['error', 'prefer-single'],
        'indent': ['error'],
        'semi': ['error', 'never'],
        'quotes': ['error', 'single'],
        'no-unused-vars': 'warn',
        // "graphql/named-operations": ["error"],
        'graphql/capitalized-type-name': ['error'],
        'graphql/no-deprecated-fields': ['error'],
        'graphql/template-strings': [
            'error',
            {
                // Import default settings for your GraphQL client. Supported values:
                // 'apollo', 'relay', 'lokka', 'fraql', 'literal'
                'env': 'literal'

                // // Import your schema JSON here
                // "schemaJson": "node_modules/@octokit/graphql-schema/schema.json"

                // OR provide absolute path to your schema JSON (but not if using `eslint --cache`!)
                // schemaJsonFilepath: path.resolve(__dirname, './schema.json'),

                // OR provide the schema in the Schema Language format
                // schemaString: printSchema(schema),

                // tagName is gql by default
            }
        ]
    },
    settings:  {
        react:  {
            version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    }
}
