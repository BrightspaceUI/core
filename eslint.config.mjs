import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { includeIgnoreFile } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
    includeIgnoreFile(gitignorePath),
    ...compat.extends("brightspace/lit-config").map(c => ({
		...c,
		files:['**/*.js','**/*.html']
	})),
    {
        languageOptions: {
            globals: {
                Prism: false,
            },
        },
    },
    {
        files: ['**/*.js','**/*.html'],
        rules: {
            "no-restricted-syntax": [0, "CatchClause[param=null]"]
        },
    },
    {
        files: ["**/demo/**.html"],
        rules: {
            "no-console": 0,
        },
    },
    {
        files: ["mixins/demo/**.html"],

        rules: {
            quotes: 0,
            "no-undef": 0,
            indent: 0,
        },
    },
    ...compat.extends("brightspace/testing-config").map(config => ({
        ...config,
        files: ["**/test/*"],
    })),
    ...compat.extends("brightspace/node-config").map(config => ({
        ...config,
        files: ["cli/*"],
		rules: {"no-console":0}
    })),
];
