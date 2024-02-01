import { css, unsafeCSS } from 'lit';

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
codeLanguages.set('regex', 'Regex');
codeLanguages.set('sql', 'SQL');
codeLanguages.set('wolfram', 'Wolfram');

export const colorModes = {
	LIGHT: 'light',
	DARK: 'dark'
};

const darkColors = Object.freeze({
	background: '#202122',
	language: '#90989d',
	lineNumbers: '#9ea5a9',
	lineNumbersBackground: '#303133',
	tokenDefault: '#cdd5dc',
	tokenComment: '#81898d',
	tokenPunctuation: '#cdd5dc',
	tokenNumber: '#cdd5dc',
	tokenUrl: '#cdd5dc',
	tokenOperator: '#cdd5dc',
	tokenInterpolation: '#92d1ff',
	tokenAttributeName: '#92d1ff',
	tokenConstant: '#00d2ed',
	tokenProperty: '#92d1ff',
	tokenTag: '#2899e9',
	tokenBoolean: '#2896e4',
	tokenEntity: '#29a6ff',
	tokenInterpolationPunctuation: '#29a6ff',
	tokenFunction: '#fff9d6',
	tokenClassName: '#2ccfb0',
	tokenSymbol: '#2de2c0',
	tokenBuiltin: '#fd4e9d',
	tokenKeyword: '#e94a92',
	tokenAtRule: '#fd4e9d',
	tokenSelector: '#fff9d6',
	tokenImportant: '#ff575a',
	tokenRegex: '#29A6FF',
	tokenString: '#e9ba79',
	tokenChar: '#e9ba79',
	tokenAttributeValue: '#e9ba79'
});

const lightColors = Object.freeze({
	background: '#f9fbff',
	language: '#6e7477',
	lineNumbers: '#6e7477',
	lineNumbersBackground: '#f1f5fb',
	tokenDefault: '#202122',
	tokenComment: '#90989d',
	tokenPunctuation: '#494c4e',
	tokenNumber: '#494c4e',
	tokenUrl: '#494c4e',
	tokenOperator: '#006fbf',
	tokenInterpolation: '#006fbf',
	tokenAttributeName: '#006fbf',
	tokenConstant: '#035670',
	tokenProperty: '#008eab',
	tokenTag: '#006fbf',
	tokenBoolean: '#004489',
	tokenEntity: '#004489',
	tokenInterpolationPunctuation: '#004489',
	tokenFunction: '#006fbf',
	tokenClassName: '#00635e',
	tokenSymbol: '#00635e',
	tokenBuiltin: '#d40067',
	tokenKeyword: '#d40067',
	tokenAtRule: '#d40067',
	tokenSelector: '#006fbf',
	tokenImportant: '#cd2026',
	tokenRegex: '#006fbf',
	tokenString: '#c74c00',
	tokenChar: '#c74c00',
	tokenAttributeValue: '#c74c00',
	tokenCombinator: '#202122'
});

export const getCodeColors = mode => {
	return mode === colorModes.DARK ? darkColors : lightColors;
};

const generateColorVariables = (mode, theme) => {
	const colors = getCodeColors(mode, theme);
	const keySelector = mode === colorModes.DARK ? '.d2l-code-dark' : '.d2l-code';
	return `
		pre[class*="language-"]${keySelector},
		code[class*="language-"]${keySelector} {
			--d2l-code-background: ${colors.background};
			--d2l-code-language: ${colors.language};
			--d2l-code-line-numbers: ${colors.lineNumbers};
			--d2l-code-line-numbers-background: ${colors.lineNumbersBackground};
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
		}
	`;
};

export const codeStyles = css`

	${unsafeCSS(generateColorVariables(colorModes.LIGHT))}
	${unsafeCSS(generateColorVariables(colorModes.DARK))}

	pre[class*="language-"].d2l-code,
	pre[class*="language-"].d2l-code > code[class*="language-"],
	code[class*="language-"].d2l-code {
		font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
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
		font-family: "Lato", "Lucida Sans Unicode", "Lucida Grande", sans-serif;
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

	pre[class*="language-"].d2l-code.line-numbers {
		counter-reset: linenumber;
		padding-left: 3.8em;
		position: relative;
	}

	pre[class*="language-"].d2l-code.line-numbers > code {
		position: relative;
		white-space: inherit;
	}

	.d2l-code.line-numbers > code > .line-numbers-rows {
		background-color: var(--d2l-code-line-numbers-background);
		border-bottom-right-radius: 6px;
		border-top-right-radius: 6px;
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

	span.inline-color-wrapper {
		/*
		 * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2">
		 *     <path fill="gray" d="M0 0h2v2H0z"/>
		 *     <path fill="white" d="M0 0h1v1H0zM1 1h1v1H1z"/>
		 * </svg>
		 */
		background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9ImdyYXkiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48L3N2Zz4=");
		/* Prevent visual glitches where one pixel from the repeating pattern could be seen */
		background-position: center;
		background-size: 110%;
		border: 1px solid white;
		border-radius: 2px;
		box-sizing: border-box;
		display: inline-block;
		height: 1.333ch;
		margin: 0 0.333ch;
		outline: 1px solid rgba(0, 0, 0, 0.5);
		overflow: hidden;
		width: 1.333ch;
	}

	span.inline-color {
		display: block;
		/* Prevent visual glitches again */
		height: 120%;
		width: 120%;
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

const languageAddons = {
	css: [{ key: 'css-extras', type: 'lang' }, { key: 'inline-color', type: 'plugin' }]
};

const loadLanguageAddons = async key => {
	if (!languageAddons[key]) return;
	return Promise.all(languageAddons[key].map(addon => {
		if (addon.type === 'lang') return loadLanguage(addon.key);
		else return loadPlugin(addon.key);
	}));
};

let prismLoaded;

const loadPrism = () => {
	if (prismLoaded) return prismLoaded;

	// Set Prism to manual mode before loading to make sure
	// we don't automatically highlight before we finish
	// configuring it.
	window.Prism = window.Prism || {};
	Prism.manual = true;

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
		loadLanguageAddons(languageInfo.key),
		lineNumbers ? loadPlugin('line-numbers') : null
	]);

	if (!elem.dataset.language && languageInfo.key !== 'plain') elem.dataset.language = languageInfo.desc;
	Prism.highlightElement(code);
}

class HtmlBlockCodeRenderer {

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

export function createHtmlBlockRenderer() {
	return new HtmlBlockCodeRenderer();
}
