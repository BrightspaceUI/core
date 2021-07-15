import { css } from 'lit-element/lit-element.js';

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
		script.src = `https://s.brightspace.com/lib/prismjs/1.24.1-beta.1/components/prism-${component}.min.js`;
		document.head.appendChild(script);
	});

	return languagesLoaded[component];
};

let prismLoaded = (window.Prism ? Promise.resolve() : undefined);

const loadPrism = () => {
	if (prismLoaded) return prismLoaded;

	prismLoaded = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;
		script.src = 'https://s.brightspace.com/lib/prismjs/1.24.1-beta.1/prism.js';
		document.head.appendChild(script);
	});

	return prismLoaded;
};

export function isCodeSample(elem) {
	return elem && elem.tagName === 'PRE' && elem.className.indexOf('language-') !== -1;
}

export async function formatCodeSample(elem) {
	if (!isCodeSample(elem)) return;

	const language = getLanguage(elem);

	await loadPrism(); // must be loaded before loading languages
	await loadLanguage(language);

	if (!elem.dataset.language) elem.dataset.language = language;
	Prism.highlightElement(elem);
}

export async function htmlBlockCodeSampleRenderer(elem) {

	const codeSamples = [...elem.querySelectorAll('pre[class*="language-"]')];
	if (codeSamples.length === 0) return elem;

	await loadPrism(); // must be loaded before loading languages
	await Promise.all(codeSamples.map(codeSample => {
		const language = getLanguage(codeSample);
		if (!codeSample.dataset.language) codeSample.dataset.language = language;
		return loadLanguage(language);
	}));

	codeSamples.forEach(codeSample => Prism.highlightElement(codeSample));

	return elem;
}

export const codeSampleStyles = css`
	code[class*="language-"],
	pre[class*="language-"] {
		color: #ccc;
		background: none;
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
		font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		line-height: 1.5;
		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;
		text-shadow: none;
		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
	}

	/* Code blocks */
	pre[class*="language-"] {
		font-size: 14px;
		padding: 1em;
		margin: .5em 0;
		overflow: auto;
		position: relative;
	}

	pre[class*="language-"]::before {
		color: #6e7376;
		content: attr(data-language);
		font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
		position: absolute;
		margin: 0.1rem 0.4rem;
		right: 0;
		top: 0;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background: #2d2d2d;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		padding: .1em;
		border-radius: .3em;
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
		color: #D4D4D4;
	}

	.token.interpolation,
	.token.attr-name,
	.token.constant,
	.token.property {
		color: #9CDCFE;
	}

	.token.tag,
	.token.boolean,
	.token.entity,
	.token.interpolation-punctuation {
		color: #569CD6;
	}

	.token.function {
		color: #DCDCAA;
	}

	.token.class-name {
		color: #4EC9B0;
	}

	.token.keyword,
	.token.atrule {
		color: #C586C0;
	}

	.token.selector {
		color: #D7BA7D;
	}

	.token.important,
	.token.regex {
		color: #D16969;
	}

	.token.string,
	.token.char,
	.token.attr-value {
		color: #CE9178;
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
		position: relative;
		padding-left: 3.8em;
		counter-reset: linenumber;
	}

	pre[class*="language-"].line-numbers > code {
		position: relative;
		white-space: inherit;
	}

	.line-numbers .line-numbers-rows {
		position: absolute;
		pointer-events: none;
		top: 0;
		font-size: 100%;
		left: -3.8em;
		width: 3em; /* works for line-numbers below 1000 lines */
		letter-spacing: -1px;
		border-right: 1px solid #999;

		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

	}

	.line-numbers-rows > span {
		display: block;
		counter-increment: linenumber;
	}

	.line-numbers-rows > span:before {
		content: counter(linenumber);
		color: #999;
		display: block;
		padding-right: 0.8em;
		text-align: right;
	}
`;
