import '../button.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { runButtonPropertyTests } from './button-shared-tests.js';

describe('d2l-button', () => {

	const getFixture = async(props = {}) => {
		const attrs = Object.entries(props).map(([key, value]) => {
			const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
			if (typeof value === 'boolean') {
				return value ? attrName : '';
			}
			return `${attrName}="${value}"`;
		}).filter(Boolean).join(' ');
		return await fixture(staticHtml`<d2l-button ${unsafeStatic(attrs)}>Button</d2l-button>`);
	};

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button>Normal Button</d2l-button>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

	});

	runButtonPropertyTests(getFixture);

	describe('button specific properties', () => {

		it('should set aria-label property', async() => {
			const el = await fixture(html`<d2l-button aria-label="Custom Label">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-label')).to.equal('Custom Label');
		});

	});

});
