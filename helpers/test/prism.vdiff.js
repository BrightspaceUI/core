import { expect, fixture, html } from '@brightspace-ui/testing';
import { classMap } from 'lit/directives/class-map.js';
import { formatCodeElement } from '../prism.js';

const jsFunction =
`function helloGrumpy(name) { /* ... */ }
helloGrumpy('Wizard');`;
const jsFullFunction =
`function helloGrumpy(name) {
	console.log(\`Hi there \${name}.\`);
}
helloGrumpy('Wizard');`;

function createCodeWrapper({ content, dark, lineNumbers, language, inline }) {
	const classes = {
		'd2l-code': true,
		'd2l-code-dark': dark,
		'line-numbers': lineNumbers
	};
	if (inline) classes[`language-${language}`] = true;
	return !inline ? html`
		<div style="max-width: 500px;">
			<pre class="${classMap(classes)}"><code class="language-${language}">${content}</code></pre>
		</div>
	` : html`
		<div style="width: 400px;">
			<p>Some inline code... <code class="${classMap(classes)}">${content}</code> Mmmm, yummy code.</p>.
		</div>
	`;
}

describe('prism-helper', () => {

	describe('general', () => {
		[
			{ name: 'block', content: jsFullFunction, language: 'javascript' },
			{ name: 'block-line-numbers', content: jsFullFunction, language: 'javascript', lineNumbers: true },
			{ name: 'inline', content: 'const jelly = \'donuts\';', language: 'javascript', inline: true }
		].forEach(({ name, content, language, lineNumbers, inline }) => {
			['light', 'dark'].forEach(color => {
				it(`${name}-${color}`, async() => {
					const elem = await fixture(createCodeWrapper({ content, dark: color === 'dark', language, lineNumbers, inline }));
					window.codeFormatted = await formatCodeElement(elem.querySelector('.d2l-code'));
					await expect(elem.querySelector('pre, p')).to.be.golden();
				});
			});
		});
	});

	describe('tokens', () => {
		[
			{ token: 'keyword', language: 'javascript', content: 'import { stuff } from \'some/where.js\';' },
			{ token: 'builtin', language: 'python', content: 'pi = round(float(\'3.14159\'), 2)' },
			{ token: 'class-name', language: 'javascript', content: 'class Wizard extends Human { /* ... */ }' },
			{ token: 'function', content: jsFunction, language: 'javascript' },
			{ token: 'parameter', language: 'javascript', content: 'function helloGrumpy(name) { /* ... */ }' },
			{ token: 'boolean', language: 'javascript', content: 'const wizardsLikeBeer = false;' },
			{ token: 'number', language: 'javascript', content: 'const favouriteNumber = 3.14159;' },
			{ token: 'string', language: 'javascript', content: 'const hiGrumpy = \'Hi Grumpy!\';' },
			{ token: 'template-string', language: 'javascript', content: 'const hiGrumpy = `Hi Grumpy!`;' },
			{ token: 'interpolation', language: 'javascript', content: 'console.log(`Hi there ${name}.`);' },
			{ token: 'regex', language: 'javascript', content: html`let entity = /&amp;#x?[\\da-f]{1,8};/;` },
			{ token: 'url', language: 'css', content: 'body { background: url("wizard.png"); }' },
			{ token: 'operator', language: 'javascript', content: html`x += (y + 4 &gt;&gt; -z === w) ? b ** c : ~a;` },
			{ token: 'variable', language: 'sql', content: 'DECLARE @MyCounter INT;' },
			{ token: 'constant', language: 'javascript', content: 'const PI = 3.14159;' },
			{ token: 'property', language: 'css', content: '.grumpy > img { height: 100%; }' },
			{ token: 'punctuation', language: 'javascript', content: 'import { stuff } from \'some/where.js\';' },
			{ token: 'important', language: 'css', content: '.grumpy > img { height: 100% !important; }' },
			{ token: 'comment', language: 'javascript', content: '/* grump wizards */' },
			{ token: 'tag', language: 'markup', content: html`&lt;h1&gt;Grumpy Wizards&lt;/h1&gt;` },
			{ token: 'attribute', language: 'markup', content: html`&lt;h1 class="dangerous"&gt;Grumpy Wizards&lt;/h1&gt;` },
			{ token: 'namespace', language: 'java', content: 'throw new java.lang.UnsupportedOperationException();' },
			{ token: 'prolog', language: 'markup', content: html`&lt;?xml version="1.0" encoding="utf-8"?&gt;` },
			{ token: 'doctype', language: 'markup', content: html`&lt;!DOCTYPE html&gt;` },
			{ token: 'cdata', language: 'markup', content: html`&lt;![CDATA[ grumpy wizards eat donuts ]]&gt;` },
			{ token: 'entity', language: 'markup', content: html`&amp;pound; &amp;#163;` },
			{ token: 'atrule', language: 'css', content: '@media (prefers-reduced-motion: reduce) { /* ... */ }' },
			{ token: 'selector', language: 'css', content: '.grumpy > img { /* ... */ }' },
			{ token: 'null', language: 'json', content: '{ "fritter": null }' },
			{ token: 'color', language: 'css', content: 'border: 1px solid #006fbf;' },
		].forEach(({ token, content, language }) => {
			['light', 'dark'].forEach(color => {
				it(`${token}-${color}`, async() => {
					const elem = await fixture(createCodeWrapper({ content, dark: color === 'dark', language }));
					window.codeFormatted = await formatCodeElement(elem.querySelector('.d2l-code'));
					await expect(elem).to.be.golden(elem.querySelector('pre'));
				});
			});
		});
	});
});
