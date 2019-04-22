import { css } from 'lit-element/lit-element.js';

export const themeStyles = css`
	/**
	 * prism.js VSCode's Dark+ theme for JavaScript, CSS and HTML
	 * Modelled after https://github.com/dunstontc/atom-vscode-syntax
	 */

	code[class*="language-"],
	pre[class*="language-"] {
		color: #ccc;
		background: none;
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

		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;

	}

	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: .5em 0;
		overflow: auto;
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
`;
