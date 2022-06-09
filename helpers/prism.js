import { css } from 'lit-element/lit-element.js';

window.Prism = window.Prism || {};
Prism.manual = true;

//const prismLocation = 'https://s.brightspace.com/lib/prismjs/dev/e6c680b249943c96f8a12f0097730103874da570';
const prismLocation = '/node_modules/prismjs';

export const codeSampleStyles = css`

	code[class*="language-"],
	pre[class*="language-"] {
		background-color: none;
		color: #cccccc;
		font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
		line-height: 1.5;
		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;
		text-align: left;
		text-shadow: none;
		white-space: pre;
		word-break: normal;
		word-spacing: normal;
		word-wrap: normal;
	}

	/* Code blocks */
	pre[class*="language-"] {
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
		font-size: 14px;
		margin: 0.5em 0;
		overflow: auto;
		padding: 1em;
		position: relative;
	}

	pre[class*="language-"]::before {
		color: #6e7376;
		content: attr(data-language);
		font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
		margin: 0.1rem 0.4rem;
		position: absolute;
		right: 0;
		top: 0;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background-color: #2d2d2d;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		border-radius: 0.3em;
		padding: 0.1em;
		white-space: normal;
	}

	.token.comment,
	.token.block-comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: #808080;
	}

	.token.punctuation,
	.token.number,
	.token.url,
	.token.operator {
		color: #d4d4d4;
	}

	.token.interpolation,
	.token.attr-name,
	.token.constant,
	.token.property {
		color: #9cdcfe;
	}

	.token.tag,
	.token.boolean,
	.token.entity,
	.token.interpolation-punctuation {
		color: #569cd6;
	}

	.token.function {
		color: #dcdcaa;
	}

	.token.class-name {
		color: #4ec9b0;
	}

	.token.keyword,
	.token.atrule {
		color: #c586c0;
	}

	.token.selector {
		color: #d7ba7d;
	}

	.token.important,
	.token.regex {
		color: #d16969;
	}

	.token.string,
	.token.char,
	.token.attr-value {
		color: #ce9178;
	}

	.token.important,
	.token.bold {
		font-weight: bold;
	}
	.token.italic {
		font-style: italic;
	}

	.token.entity {
		cursor: help;
	}

	.token.inserted {
		color: green;
	}

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
		border-right: 1px solid #999999;
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
		color: #999999;
		color: #ffffff;
		content: counter(linenumber);
		display: block;
		padding-right: 0.8em;
		text-align: right;
	}
`;

const getLanguage = elem => {
	const classes = elem.classList;
	for (let i = 0; i < classes.length; i++) {
		if (classes[i].startsWith('language-')) {
			return classes[i].substring(9);
		}
	}
};

const languagesLoaded = {
	clike: Promise.resolve(),
	css: Promise.resolve(),
	javascript: Promise.resolve(),
	markup: Promise.resolve()
};

const loadLanguage = async component => {
	if (languagesLoaded[component]) return languagesLoaded[component];

	languagesLoaded[component] = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;
		script.src = `${prismLocation}/components/prism-${component}.min.js`;
		document.head.appendChild(script);
	});

	return languagesLoaded[component];
};

const pluginsLoaded = {};

const loadPlugin = async plugin => {
	if (pluginsLoaded[plugin]) return pluginsLoaded[plugin];

	pluginsLoaded[plugin] = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;
		script.src = `${prismLocation}/plugins/${plugin}/prism-${plugin}.js`;
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
			style.textContent = codeSampleStyles.cssText;
			style.onload = resolve;
			document.head.appendChild(style);
		})
	]);

	return prismLoaded;
};

const getCodeElement = elem => {
	if (!elem) return;
	if (elem.tagName === 'CODE') return elem;
	if (!elem.tagName === 'PRE') return;
	return elem.querySelector('code');
};

export async function formatCodeSample(elem) {
	const code = getCodeElement(elem);

	if (code.className.indexOf('language-') === -1) return;

	const language = getLanguage(code);

	await loadPrism(); // must be loaded before loading plugins or languages
	await Promise.all([
		loadLanguage(language),
		code.classList.contains('line-numbers') ? loadPlugin('line-numbers') : null
	]);

	if (!elem.dataset.language) elem.dataset.language = language;
	Prism.highlightElement(code);
}
