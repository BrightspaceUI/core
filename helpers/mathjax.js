/* When updating MathJax, update mathjaxBaseUrl to use the new version
 * and verify that the font mappings included in mathjaxFontMappings
 * match what's present in the MathJax-src repo.
 */

const mathjaxContextAttribute = 'data-mathjax-context';
const mathjaxBaseUrl = 'https://s.brightspace.com/lib/mathjax/3.2.2';

const mathjaxFontMappings = new Map([
	['MJXTEX', 'MathJax_Main-Regular'],
	['MJXTEX-B', 'MathJax_Main-Bold'],
	['MJXTEX-I', 'MathJax_Math-Italic'],
	['MJXTEX-MI', 'MathJax_Main-Italic'],
	['MJXTEX-BI', 'MathJax_Math-BoldItalic'],
	['MJXTEX-S1', 'MathJax_Size1-Regular'],
	['MJXTEX-S2', 'MathJax_Size2-Regular'],
	['MJXTEX-S3', 'MathJax_Size3-Regular'],
	['MJXTEX-S4', 'MathJax_Size4-Regular'],
	['MJXTEX-A', 'MathJax_AMS-Regular'],
	['MJXTEX-C', 'MathJax_Calligraphic-Regular'],
	['MJXTEX-CB', 'MathJax_Calligraphic-Bold'],
	['MJXTEX-FR', 'MathJax_Fraktur-Regular'],
	['MJXTEX-FRB', 'MathJax_Fraktur-Bold'],
	['MJXTEX-SS', 'MathJax_SansSerif-Regular'],
	['MJXTEX-SSB', 'MathJax_SansSerif-Bold'],
	['MJXTEX-SSI',  'MathJax_SansSerif-Italic'],
	['MJXTEX-SC', 'MathJax_Script-Regular'],
	['MJXTEX-T', 'MathJax_Typewriter-Regular'],
	['MJXTEX-V', 'MathJax_Vector-Regular'],
	['MJXTEX-VB', 'MathJax_Vector-Bold']
]);

let mathJaxLoaded;
let renderingPromise = Promise.resolve();

export class HtmlBlockMathRenderer {

	get contextAttributes() {
		return [mathjaxContextAttribute];
	}

	async render(elem, options) {
		if (!options.contextValues) return elem;
		const contextVal = options.contextValues.get(mathjaxContextAttribute);
		if (contextVal === undefined) return elem;

		const context = JSON.parse(contextVal) || {};
		const isLatexSupported = context.renderLatex;

		if (!elem.querySelector('math') && !(isLatexSupported && /\$\$|\\\(|\\\[|\\begin{|\\ref{|\\eqref{/.test(elem.innerHTML))) return elem;

		const mathJaxConfig = {
			deferTypeset: true,
			renderLatex: isLatexSupported,
			outputScale: context.outputScale || 1
		};

		await loadMathJax(mathJaxConfig);

		// MathJax 3 does not support newlines, but it does persist styles, so add custom styles to mimic a linebreak
		// This work-around should be removed when linebreaks are natively supported.
		// MathJax issue: https://github.com/mathjax/MathJax/issues/2312
		// A duplicate that explains our exact issue: https://github.com/mathjax/MathJax/issues/2495
		elem.querySelectorAll('mspace[linebreak="newline"]').forEach(elm => {
			elm.style.display = 'block';
			elm.style.height = '0.5rem';
		});

		await window.MathJax.startup.promise;
		renderingPromise = renderingPromise.then(() => window.MathJax.typesetPromise([elem]));
		await renderingPromise;

		// If we're using deferred rendering, we need to manually attach MathJax's styles to the DOM.
		if (options.noDeferredRendering) return;

		const styleElm = window.MathJax.chtmlStylesheet().cloneNode(true);
		styleElm.id = 'd2l-mathjax-styles';

		if (!elem.querySelector(`#${styleElm.id}`)) {
			elem.appendChild(styleElm);
		}
	}

}

export function loadMathJax(mathJaxConfig) {

	if (mathJaxLoaded) return mathJaxLoaded;

	window.MathJax = {
		chtml: {
			adaptiveCSS: false,
			scale: (mathJaxConfig && mathJaxConfig.outputScale) || 1
		},
		options: {
			menuOptions: {
				settings: { zoom: 'None' }
			}
		},
		loader: { load: ['ui/menu'] },
		startup: {
			typeset: !(mathJaxConfig && mathJaxConfig.deferTypeset)
		}
	};

	if (mathJaxConfig && mathJaxConfig.deferTypeset && !document.head.querySelector('#d2l-mathjax-fonts') && !document.head.querySelector('#MJX-CHTML-styles')) {
		const styleElem = document.createElement('style');
		styleElem.id = 'd2l-mathjax-fonts';

		let fontImportStyles = '';
		mathjaxFontMappings.forEach((font, family) => {
			fontImportStyles +=
				`\n@font-face {
					font-family: ${family};
					src: url("${mathjaxBaseUrl}/output/chtml/fonts/woff-v2/${font}.woff") format("woff");
				}`;
		});

		styleElem.textContent = fontImportStyles;
		document.head.appendChild(styleElem);
	}

	mathJaxLoaded = new Promise(resolve => {
		const script = document.createElement('script');
		script.async = 'async';
		script.onload = resolve;

		const component = mathJaxConfig && mathJaxConfig.renderLatex
			? 'tex-mml-chtml'
			: 'mml-chtml';

		script.src = `${mathjaxBaseUrl}/${component}.js`;
		document.head.appendChild(script);
	});

	return mathJaxLoaded;

}
