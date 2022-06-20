import { css, unsafeCSS } from 'lit-element/lit-element.js';

window.Prism = window.Prism || {};
Prism.manual = true;

const prismLocation = 'https://s.brightspace.com/lib/prismjs/1.28.0';
//const prismLocation = '/node_modules/prismjs'; // for local debugging

// If adding a language, check its Prism dependencies and modify languageDependencies below if necessary
export const codeLanguages = new Map();
codeLanguages.set('arduino', 'Arduino');
codeLanguages.set('armasm', 'ARM Assembly');
codeLanguages.set('bash', 'Bash');
codeLanguages.set('c', 'C');
codeLanguages.set('clike', 'C-like');
codeLanguages.set('cpp', 'C++');
codeLanguages.set('csharp', 'C#');
codeLanguages.set('css', 'CSS');
codeLanguages.set('haskell', 'Haskell');
codeLanguages.set('java', 'Java');
codeLanguages.set('javascript', 'JavaScript');
codeLanguages.set('json', 'JSON');
codeLanguages.set('kotlin', 'Kotlin');
codeLanguages.set('latex', 'LaTeX');
codeLanguages.set('markup', 'Markup');
codeLanguages.set('matlab', 'MATLAB');
codeLanguages.set('plain', 'Plain Text');
codeLanguages.set('python', 'Python');
codeLanguages.set('r', 'R');
codeLanguages.set('racket', 'Racket');
codeLanguages.set('sql', 'SQL');
codeLanguages.set('wolfram', 'Wolfram');

export const colorModes = {
	LIGHT: 'light',
	DARK: 'dark'
};

const darkColors = Object.freeze({
	background: '#2d2d2d',
	language: '#6e7376',
	lineNumbers: '#ffffff',
	lineNumbersSeparator: '#999999',
	tokenDefault: '#cccccc',
	tokenComment: '#808080',
	tokenPunctuation: '#d4d4d4',
	tokenNumber: '#d4d4d4',
	tokenUrl: '#d4d4d4',
	tokenOperator: '#d4d4d4',
	tokenInterpolation: '#9cdcfe',
	tokenAttributeName: '#9cdcfe',
	tokenConstant: '#9cdcfe',
	tokenProperty: '#9cdcfe',
	tokenTag: '#569cd6',
	tokenBoolean: '#569cd6',
	tokenEntity: '#569cd6',
	tokenInterpolationPunctuation: '#569cd6',
	tokenFunction: '#dcdcaa',
	tokenClassName: '#4ec9b0',
	tokenSymbol: '#4ec9b0',
	tokenBuiltin: '#c586c0',
	tokenKeyword: '#c586c0',
	tokenAtRule: '#c586c0',
	tokenSelector: '#d7ba7d',
	tokenImportant: '#d16969',
	tokenRegex: '#d16969',
	tokenString: '#ce9178',
	tokenChar: '#ce9178',
	tokenAttributeValue: '#ce9178'
});

const lightColors = Object.freeze({
	background: '#f2f1f1',
	language: '#1b1b1b',
	lineNumbers: '#1b1b1b',
	lineNumbersSeparator: '#1b1b1b',
	tokenDefault: '#1b1b1b',
	tokenComment: '#9e9e9e',
	tokenPunctuation: '#9e9e9e',
	tokenNumber: '#007936',
	tokenUrl: '#9e9e9e',
	tokenOperator: '#9e9e9e',
	tokenInterpolation: '#872bff',
	tokenAttributeName: '#d30038',
	tokenConstant: '#007936',
	tokenProperty: '#d30038',
	tokenTag: '#007936',
	tokenBoolean: '#007936',
	tokenEntity: 'inherit',
	tokenInterpolationPunctuation: '#872bff',
	tokenFunction: '#d30038',
	tokenClassName: '#d30038',
	tokenSymbol: '#007936',
	tokenBuiltin: '#872bff',
	tokenKeyword: '#0069c2',
	tokenAtRule: '#007936',
	tokenSelector: '#872bff',
	tokenImportant: 'inherit',
	tokenRegex: 'inherit',
	tokenString: '#007936',
	tokenChar: '#007936',
	tokenAttributeValue: '#007936'
});

export const getCodeColors = mode => {
	return mode === colorModes.DARK ? darkColors : lightColors;
};

const generateColorVariables = mode => {
	const colors = getCodeColors(mode);
	return `
		--d2l-code-background: ${colors.background};
		--d2l-code-language: ${colors.language};
		--d2l-code-line-numbers: ${colors.lineNumbers};
		--d2l-code-line-numbers-separator: ${colors.lineNumbersSeparator};
		--d2l-code-token-atrule: ${colors.tokenAtRule};
		--d2l-code-token-attribute-name: ${colors.tokenAttributeName};
		--d2l-code-token-attribute-value: ${colors.tokenAttributeValue};
		--d2l-code-token-boolean: ${colors.tokenBoolean};
		--d2l-code-token-builtin: ${colors.tokenBuiltin};
		--d2l-code-token-char: ${colors.tokenChar};
		--d2l-code-token-class-name: ${colors.tokenClassName};
		--d2l-code-token-comment: ${colors.tokenComment};
		--d2l-code-token-constant: ${colors.tokenConstant};
		--d2l-code-token-default: ${colors.tokenDefault};
		--d2l-code-token-entity: ${colors.tokenEntity};
		--d2l-code-token-function: ${colors.tokenFunction};
		--d2l-code-token-important: ${colors.tokenImportant};
		--d2l-code-token-interpolation: ${colors.tokenInterpolation};
		--d2l-code-token-interpolation-punctuation: ${colors.tokenInterpolationPunctuation};
		--d2l-code-token-keyword: ${colors.tokenKeyword};
		--d2l-code-token-number: ${colors.tokenNumber};
		--d2l-code-token-operator: ${colors.tokenOperator};
		--d2l-code-token-property: ${colors.tokenProperty};
		--d2l-code-token-punctuation: ${colors.tokenPunctuation};
		--d2l-code-token-regex: ${colors.tokenRegex};
		--d2l-code-token-selector: ${colors.tokenSelector};
		--d2l-code-token-string: ${colors.tokenString};
		--d2l-code-token-symbol: ${colors.tokenSymbol};
		--d2l-code-token-tag: ${colors.tokenTag};
		--d2l-code-token-url: ${colors.tokenUrl};
	`;
};

export const codeStyles = css`

	pre[class*="language-"].d2l-code,
	code[class*="language-"].d2l-code {
		${unsafeCSS(generateColorVariables(colorModes.LIGHT))}
	}

	pre[class*="language-"].d2l-code-dark,
	code[class*="language-"].d2l-code-dark {
		${unsafeCSS(generateColorVariables(colorModes.DARK))}
	}

	pre[class*="language-"].d2l-code,
	pre[class*="language-"].d2l-code > code[class*="language-"],
	code[class*="language-"].d2l-code {
		font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
		line-height: 1.5;
		text-shadow: none;
	}

	pre[class*="language-"].d2l-code > code[class*="language-"],
	code[class*="language-"].d2l-code {
		color: var(--d2l-code-token-default);
		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
		white-space: pre;
		word-break: normal;
		word-spacing: normal;
		word-wrap: normal;
	}

	pre[class*="language-"].d2l-code {
		background-color: var(--d2l-code-background);
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
		font-size: 14px;
		margin: 0.5em 0;
		overflow: auto;
		padding: 1em;
		position: relative;
		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;
		text-align: left;
	}

	pre[class*="language-"].d2l-code::before {
		color: var(--d2l-code-language);
		content: attr(data-language);
		font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
		margin: 0.1rem 0.4rem;
		position: absolute;
		right: 0;
		top: 0;
	}

	code[class*="language-"].d2l-code {
		background-color: var(--d2l-code-background);
		border-radius: 6px;
		padding: 0.1em;
		white-space: normal;
	}

	.token.comment,
	.token.block-comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: var(--d2l-code-token-comment);
	}

	.token.punctuation { color: var(--d2l-code-token-punctuation); }
	.token.number { color: var(--d2l-code-token-number); }
	.token.operator { color: var(--d2l-code-token-operator); }

	.token.interpolation { color: var(--d2l-code-token-interpolation); }
	.token.attr-name { color: var(--d2l-code-token-attribute-name); }
	.token.constant { color: var(--d2l-code-token-constant); }
	.token.property { color: var(--d2l-code-token-property); }

	.token.tag { color: var(--d2l-code-token-tag); }
	.token.boolean { color: var(--d2l-code-token-boolean); }
	.token.entity { color: var(--d2l-code-token-entity); }
	.token.interpolation-punctuation { color: var(--d2l-code-token-interpolation-punctuation); }

	.token.function { color: var(--d2l-code-token-function); }

	.token.class-name { color: var(--d2l-code-token-class-name); }
	.token.symbol { color: var(--d2l-code-token-symbol); }

	.token.builtin { color: var(--d2l-code-token-builtin); }
	.token.keyword { color: var(--d2l-code-token-keyword); }
	.token.atrule { color: var(--d2l-code-token-atrule); }

	.token.selector { color: var(--d2l-code-token-selector); }

	.token.important { color: var(--d2l-code-token-important); }
	.token.regex { color: var(--d2l-code-token-regex); }

	.token.string { color: var(--d2l-code-token-string); }
	.token.char { color: var(--d2l-code-token-char); }
	.token.attr-value { color: var(--d2l-code-token-attribute-value); }

	.token.url { color: var(--d2l-code-token-url); }

	.language-css .token.string,
	.style .token.string,
	.token.entity,
	.token.operator,
	.token.url {
		background-color: transparent;
	}

	pre[class*="language-"].line-numbers {
		counter-reset: linenumber;
		padding-left: 3.8em;
		position: relative;
	}

	pre[class*="language-"].line-numbers > code {
		position: relative;
		white-space: inherit;
	}

	.line-numbers .line-numbers-rows {
		border-right: 1px solid var(--d2l-code-line-numbers-separator);
		font-size: 100%;
		left: -3.8em;
		letter-spacing: -1px;
		pointer-events: none;
		position: absolute;
		top: 0;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		width: 3em; /* works for line-numbers below 1000 lines */
	}

	.line-numbers-rows > span {
		counter-increment: linenumber;
		display: block;
	}

	.line-numbers-rows > span::before {
		color: var(--d2l-code-line-numbers);
		content: counter(linenumber);
		display: block;
		padding-right: 0.8em;
		text-align: right;
	}
`;

const getLanguageInfo = elem => {
	const classes = elem.classList;
	for (let i = 0; i < classes.length; i++) {
		if (classes[i].startsWith('language-')) {
			const key = classes[i].substring(9);
			const desc = codeLanguages.get(key);
			if (desc) return { key: key, desc: desc };
		}
	}
	return { key: 'plain', desc: codeLanguages.get('plain') };
};

const languageDependencies = {
	arduino: [ 'cpp' ],
	cpp: [ 'c' ],
	racket: [ 'scheme' ]
};

const languagesLoaded = {
	clike: Promise.resolve(),
	css: Promise.resolve(),
	javascript: Promise.resolve(),
	markup: Promise.resolve(),
	plain: Promise.resolve()
};

const loadLanguage = async key => {
	if (languagesLoaded[key]) return languagesLoaded[key];

	// Prism languages can extend other anguages and must be loaded in order

	// eslint-disable-next-line no-async-promise-executor
	languagesLoaded[key] = new Promise(async resolve => {
		if (languageDependencies[key]) {
			await Promise.all(languageDependencies[key].map(dependencyKey => loadLanguage(dependencyKey)));
		}

		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;
		script.src = `${prismLocation}/components/prism-${key}.min.js`;
		document.head.appendChild(script);
	});

	return languagesLoaded[key];
};

const pluginsLoaded = {};

const loadPlugin = async plugin => {
	if (pluginsLoaded[plugin]) return pluginsLoaded[plugin];

	pluginsLoaded[plugin] = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;
		script.src = `${prismLocation}/plugins/${plugin}/prism-${plugin}.min.js`;
		document.head.appendChild(script);
	});

	return pluginsLoaded[plugin];
};

let prismLoaded;

const loadPrism = () => {
	if (prismLoaded) return prismLoaded;

	prismLoaded = Promise.all([
		new Promise(resolve => {
			const script = document.createElement('script');
			script.async = 'async';
			script.onload = resolve;
			script.src = `${prismLocation}/prism.js`;
			document.head.appendChild(script);
		}),
		new Promise(resolve => {
			const style = document.createElement('style');
			style.textContent = codeStyles.cssText;
			style.onload = resolve;
			document.head.appendChild(style);
		})
	]);

	return prismLoaded;
};

const getCodeElement = elem => {
	if (!elem) return;
	if (elem.tagName === 'CODE') return elem;
	if (elem.tagName !== 'PRE') return;
	return elem.querySelector('code');
};

export async function formatCodeElement(elem) {
	const code = getCodeElement(elem);

	if (code.className.indexOf('language-') === -1) return;

	const languageInfo = getLanguageInfo(code);
	const lineNumbers = elem.classList.contains('line-numbers') || code.classList.contains('line-numbers');

	await loadPrism(); // must be loaded before loading plugins or languages
	await Promise.all([
		loadLanguage(languageInfo.key),
		lineNumbers ? loadPlugin('line-numbers') : null
	]);

	if (!elem.dataset.language && languageInfo.key !== 'plain') elem.dataset.language = languageInfo.desc;
	Prism.highlightElement(code);

	return elem;
}

export class HtmlBlockCodeRenderer {

	get canRenderInline() {
		return true;
	}

	async render(elem) {
		const codeElements = [...elem.querySelectorAll('.d2l-code')];
		if (codeElements.length === 0) return elem;

		// wait; formatting is not synchronous due to lazy loading of Prism, languages, plugins
		await Promise.all(codeElements.map(codeElement => {
			return formatCodeElement(codeElement);
		}));

		return elem;
	}

}
