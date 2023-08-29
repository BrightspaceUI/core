import '../../colors/colors.js';
import '../meter-linear.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { styleMap } from 'lit/directives/style-map.js';

function createTemplateWrapper(content, dark) {
	const styles = {
		backgroundColor: dark && 'var(--d2l-color-celestine);',
		fontFamily: 'auto', // remove
		letterSpacing: 'normal', // remove
		padding: dark && '1rem',
		width: '250px'
	};
	return html`
		<div style=${styleMap(styles)}>
			${content}
		</div>
	`;
}

describe('meter-linear', () => {
	['normal', 'text-inline'].forEach(type => {
		[
			{ name: 'no-progress', template: (inline) => html`<d2l-meter-linear value="0" max="10" ?text-inline="${inline}"></d2l-meter-linear>` },
			{ name: 'progress', template: (inline) => html`<d2l-meter-linear value="4" max="10" ?text-inline="${inline}"></d2l-meter-linear>` },
			{ name: 'complete', template: (inline) => html`<d2l-meter-linear value="10" max="10" ?text-inline="${inline}"></d2l-meter-linear>` },
			{ name: 'percent', template: (inline) => html`<d2l-meter-linear value="4" max="10" percent ?text-inline="${inline}"></d2l-meter-linear>` },
		].forEach(({ name, template }) => {
			it(`${type}-${name}`, async() => {
				const elem = await fixture(createTemplateWrapper(template(type === 'text-inline')));
				await expect(elem.querySelector('d2l-meter-linear')).to.be.golden();
			});
		});
	});

	[true, false].forEach(rtl => {
		[
			{ name: 'normal-text-fraction', template: html`<d2l-meter-linear value="4" max="10" text="Visited: {x/y}" percent></d2l-meter-linear>` },
			{ name: 'normal-text-percent', template: html`<d2l-meter-linear value="4" max="10" text="Visited: {%}"></d2l-meter-linear>` },
			{ name: 'text-inline-text-fraction', template: html`<d2l-meter-linear value="4" max="10" text-inline text="Visited"></d2l-meter-linear>` },
			{ name: 'text-inline-text-percent', template: html`<d2l-meter-linear value="4" max="10" text-inline text="Visited" percent></d2l-meter-linear>` },
		].forEach(({ name, template }) => {
			it(`${name}${ rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(createTemplateWrapper(template), { rtl });
				await expect(elem.querySelector('d2l-meter-linear')).to.be.golden();
			});
		});
	});

	[
		{ name: 'normal-text', template: html`<d2l-meter-linear id="normal-text" value="4" max="10" text="You're doing great!"></d2l-meter-linear>` },
		{ name: 'normal-max-zero-value-zero', template: html`<d2l-meter-linear value="0" max="0" text="Visited: {x/y}" percent></d2l-meter-linear>` },
		{ name: 'normal-round-to-zero', template: html`<d2l-meter-linear value="0.004" max="10" text="Visited: {x/y}" percent></d2l-meter-linear>` },
		{ name: 'normal-over-100', template: html`<d2l-meter-linear value="15" max="10" text="Visited: {x/y}" percent></d2l-meter-linear>` },
		{ name: 'normal-max-zero-with-value', template: html`<d2l-meter-linear value="5" max="0" text="Visited: {x/y}" percent></d2l-meter-linear>` },
		{ name: 'normal-foreground-light', dark: true, template: html`<d2l-meter-linear value="4" max="10" text="Visited: {%}" foreground-light></d2l-meter-linear>` },
		{ name: 'text-inline-foreground-light', dark: true, template: html`<d2l-meter-linear value="4" max="10" text-inline text="Visited" percent foreground-light></d2l-meter-linear>` }
	].forEach(({ name, template, dark }) => {
		it(name, async() => {
			const elem = await fixture(createTemplateWrapper(template, dark));
			await expect(elem.querySelector('d2l-meter-linear')).to.be.golden();
		});
	});
});
