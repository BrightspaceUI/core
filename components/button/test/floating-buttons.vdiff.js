import '../button.js';
import '../floating-buttons.js';
import { expect, fixture, focusElem, html, nextFrame, oneEvent } from '@brightspace-ui/testing';

const lotsaCoffee = Array(22).fill(html`<p>I love Coffee!</p>`);

const floatingButtonsFixture = html`
	<div>
		${lotsaCoffee}
		<d2l-floating-buttons>
			<d2l-button primary>Primary Button</d2l-button>
			<d2l-button>Secondary Button</d2l-button>
		</d2l-floating-buttons>
	</div>
`;
const floatingButtonsShortFixture = html`
	<div>
		<div id="floating-buttons-short-content">
			<p>I love Coffee!</p>
		</div>
		<d2l-floating-buttons>
			<d2l-button primary>Brew more Coffee!</d2l-button>
		</d2l-floating-buttons>
	</div>
`;
const floatingButtonsAlwaysFloatFixture = html`
	<div>
		${lotsaCoffee}
		<d2l-floating-buttons always-float>
			<d2l-button primary>Primary Button</d2l-button>
			<d2l-button>Secondary Button</d2l-button>
		</d2l-floating-buttons>
	</div>
`;

describe('floating-buttons', () => {

	it('floats', async() => {
		const elem = await fixture(floatingButtonsFixture);
		await expect(elem).to.be.golden();
	});

	it('does not float at bottom of container', async() => {
		const elem = await fixture(floatingButtonsFixture);
		window.scrollTo(0, document.body.scrollHeight);
		await oneEvent(window, 'scroll');
		await expect(elem).to.be.golden();
	});

	it('does not float when small amount of content', async() => {
		const elem = await fixture(floatingButtonsShortFixture);
		await expect(elem).to.be.golden();
	});

	it('floats when content added to dom', async() => {
		const elem = await fixture(floatingButtonsShortFixture);
		const contentElem = document.querySelector('#floating-buttons-short-content').querySelector('p');
		contentElem.innerHTML += '<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>I love Coffe<br><br>';
		await nextFrame();
		await expect(elem).to.be.golden();
	});

	it('floats at bottom of page when always-float', async() => {
		const elem = await fixture(floatingButtonsAlwaysFloatFixture);
		window.scrollTo(0, document.body.scrollHeight);
		await expect(elem).to.be.golden();
	});

	it('is correct with rtl', async() => {
		const elem = await fixture(floatingButtonsFixture, { rtl: true });
		await expect(elem).to.be.golden();
	});

	it('floats when bounded', async() => {
		const elem = await fixture(html`<div style="border: 1px dashed #999999; height: 200px; overflow: scroll;">${floatingButtonsFixture}</div>`);
		await expect(elem).to.be.golden();
	});

	it('scrolls when obscuring element with focus', async() => {
		const elem = await fixture(html`
			<div>
				${lotsaCoffee}
				<button id="focus-me">focus-me</button>
				${lotsaCoffee}
				<d2l-floating-buttons>
					<d2l-button primary>Primary Button</d2l-button>
				</d2l-floating-buttons>
			</div>
		`);
		const focus = elem.querySelector('#focus-me');
		focus.scrollIntoView(false);
		await focusElem(focus);
		await expect(elem).to.be.golden();
	});

	describe('window less than min-height (500px)', () => {
		it('does not float', async() => {
			const elem = await fixture(floatingButtonsFixture, { viewport: { height: 499 } });
			await expect(elem).to.be.golden();
		});

		it('floats at bottom of page when always-float is true', async() => {
			const elem = await fixture(floatingButtonsAlwaysFloatFixture, { viewport: { height: 499 } });
			window.scrollTo(0, document.body.scrollHeight);
			await expect(elem).to.be.golden();
		});
	});
});
