import '../html-block.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const content = `
	Just a text node...
	<h1>heading 1</h1>
	<h2>heading 2</h2>
	<h3>heading 3</h3>
	<h4>heading 4</h4>
	<h5>heading 5</h5>
	<h6>heading 6</h6>
	<div><strong>strong</strong></div>
	<div><b>bold</b></div>
	<div>text</div>
	<pre>preformatted</pre>
	<p>paragraph</p>
	<ul>
		<li>unordered item 1</li>
		<li>unordered item 2</li>
	</ul>
	<ol>
		<li>ordered item 1</li>
		<li>ordered item 2</li>
	</ol>
	<div><a href="https://d2l.com">anchor</a></div>
	<p dir="rtl">rtl paragraph</p>
`;

const mathBlock = `
	<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
		<msup>
			<mrow>
				<mo>(</mo>
				<mrow>
					<munderover>
						<mo>∑<!-- ∑ --></mo>
						<mrow class="MJX-TeXAtom-ORD">
							<mi>k</mi>
							<mo>=</mo>
							<mn>1</mn>
						</mrow>
						<mi>n</mi>
					</munderover>
					<msub>
						<mi>a</mi>
						<mi>k</mi>
					</msub>
					<msub>
						<mi>b</mi>
						<mi>k</mi>
					</msub>
				</mrow>
				<mo>)</mo>
			</mrow>
			<mrow class="MJX-TeXAtom-ORD">
				<mspace width="negativethinmathspace"></mspace>
				<mspace width="negativethinmathspace"></mspace>
				<mn>2</mn>
			</mrow>
		</msup>
		<mo>≤<!-- ≤ --></mo>
		<mrow>
			<mo>(</mo>
			<mrow>
				<munderover>
					<mo>∑<!-- ∑ --></mo>
					<mrow class="MJX-TeXAtom-ORD">
						<mi>k</mi>
						<mo>=</mo>
						<mn>1</mn>
					</mrow>
					<mi>n</mi>
				</munderover>
				<msubsup>
					<mi>a</mi>
					<mi>k</mi>
					<mn>2</mn>
				</msubsup>
			</mrow>
			<mo>)</mo>
		</mrow>
		<mrow>
			<mo>(</mo>
			<mrow>
				<munderover>
					<mo>∑<!-- ∑ --></mo>
					<mrow class="MJX-TeXAtom-ORD">
						<mi>k</mi>
						<mo>=</mo>
						<mn>1</mn>
					</mrow>
					<mi>n</mi>
				</munderover>
				<msubsup>
					<mi>b</mi>
					<mi>k</mi>
					<mn>2</mn>
				</msubsup>
			</mrow>
			<mo>)</mo>
		</mrow>
		<mspace linebreak="newline"></mspace>
		<msup>
			<mi>e</mi>
			<mrow>
				<mi>i</mi>
				<mi>π<!-- π --></mi>
			</mrow>
		</msup>
		<mo>+</mo>
		<mn>1</mn>
		<mo>=</mo>
		<mn>0</mn>
	</math>
`;

const code = `<pre class="d2l-code d2l-code-dark"><code class="language-javascript">function helloGrumpy(name) {
	console.log(\`Hi there \${name}.\`);
}
helloGrumpy('Wizard');</code></pre>`;

describe('d2l-html-block', () => {

	const viewport = { width: 376 };

	it('empty', async() => {
		const elem = await fixture(html`<d2l-html-block style="height: 1px;"></d2l-html-block>`, { viewport });
		await expect(elem).to.be.golden();
	});

	['print', 'screen'].forEach((media) => {
		it(`typography-${media}`, async() => {
			const elem = await fixture(
				html`<d2l-html-block html="${content}"></d2l-html-block>`,
				{ media, viewport }
			);
			await expect(elem).to.be.golden();
		});
	});

	it('compact', async() => {
		const elem = await fixture(html`<d2l-html-block html="${content}" compact></d2l-html-block>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('update-content', async() => {
		const elem = await fixture(html`<d2l-html-block html="before update"></d2l-html-block>`, { viewport });
		elem.html = 'after update';
		await elem.updateComplete;
		await expect(elem).to.be.golden();
	});

	it('inline', async() => {
		const elem = await fixture(html`
			<div style="width: 500px;">
				<span>Here's an inline html-block:</span>
				<d2l-html-block inline html="I'm inline!"></d2l-html-block>
				<span>Pretty cool!</span>
			</div>
		`);
		await expect(elem).to.be.golden();
	});

	it('inline-no-deferred-rendering', async() => {
		const elem = await fixture(html`
			<div style="width: 500px;">
				<span>Here's an inline html-block:</span>
				<d2l-html-block inline no-deferred-rendering>
					I'm inline!
				</d2l-html-block>
				<span>Pretty cool!</span>
			</div>
		`);
		await expect(elem).to.be.golden();
	});

	it('large-font-size', async() => {
		const elem = await fixture(
			html`<d2l-html-block style="width: 500px;" html="&lt;div style=&quot;font-size: 42px;&quot;&gt;${content}&lt;/div&gt;"></d2l-html-block>`,
			{ viewport: { height: 2200 } }
		);
		await expect(elem).to.be.golden();
	});

	it('overflowing', async() => {
		const elem = await fixture(html`
			<d2l-html-block style="width: 500px;" html="&lt;div style=&quot;border: 1px solid black; white-space: nowrap; width: 600px;&quot;&gt;
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam!
				&lt;/div&gt;"></d2l-html-block>
		`);
		await expect(elem).to.be.golden();
	});

	it('math (block)', async() => {
		const elem = await fixture(
			html`<d2l-html-block style="width: 650px;" html="${mathBlock}"></d2l-html-block>`,
			{ mathjax: { renderLatex: true } }
		);
		await expect(elem).to.be.golden();
	});

	it('math (inline)', async() => {
		const mathInline = `
	<math xmlns="http://www.w3.org/1998/Math/MathML">
		<msup>
			<mrow>
				<mo>(</mo>
				<mrow>
					<munderover>
						<mo>∑<!-- ∑ --></mo>
						<mrow class="MJX-TeXAtom-ORD">
							<mi>k</mi>
							<mo>=</mo>
							<mn>1</mn>
						</mrow>
						<mi>n</mi>
					</munderover>
					<msub>
						<mi>a</mi>
						<mi>k</mi>
					</msub>
					<msub>
						<mi>b</mi>
						<mi>k</mi>
					</msub>
				</mrow>
				<mo>)</mo>
			</mrow>
			<mrow class="MJX-TeXAtom-ORD">
				<mspace width="negativethinmathspace"></mspace>
				<mspace width="negativethinmathspace"></mspace>
				<mn>2</mn>
			</mrow>
		</msup>
		<mo>≤<!-- ≤ --></mo>
		<mrow>
			<mo>(</mo>
			<mrow>
				<munderover>
					<mo>∑<!-- ∑ --></mo>
					<mrow class="MJX-TeXAtom-ORD">
						<mi>k</mi>
						<mo>=</mo>
						<mn>1</mn>
					</mrow>
					<mi>n</mi>
				</munderover>
				<msubsup>
					<mi>a</mi>
					<mi>k</mi>
					<mn>2</mn>
				</msubsup>
			</mrow>
			<mo>)</mo>
		</mrow>
		<mrow>
			<mo>(</mo>
			<mrow>
				<munderover>
					<mo>∑<!-- ∑ --></mo>
					<mrow class="MJX-TeXAtom-ORD">
						<mi>k</mi>
						<mo>=</mo>
						<mn>1</mn>
					</mrow>
					<mi>n</mi>
				</munderover>
				<msubsup>
					<mi>b</mi>
					<mi>k</mi>
					<mn>2</mn>
				</msubsup>
			</mrow>
			<mo>)</mo>
		</mrow>
	</math>
`;
		const elem = await fixture(
			html`<d2l-html-block style="width: 650px;" html="An equation...${mathInline} embedded inline with text, and showing placement of indicies for summations."></d2l-html-block>`,
			{ mathjax: { renderLatex: true } }
		);
		await expect(elem).to.be.golden();
	});

	it('code (block)', async() => {
		const elem = await fixture(
			html`<d2l-html-block style="width: 400px;" html="A grumpy bit of code...${code} ...makes me smile."></d2l-html-block>`
		);
		await expect(elem).to.be.golden();
	});

	it('code (inline)', async() => {
		const elem = await fixture(
			html`<d2l-html-block style="width: 400px;" html="The best type of donuts are he kind you assign in code, for example: &lt;code class=&quot;d2l-code d2l-code-dark language-javascript&quot;&gt;const jelly = 'donuts';&lt;/code&gt;. The next best type of thing you can assign in code is stuff you can ferment."></d2l-html-block>`
		);
		await expect(elem).to.be.golden();
	});

	it('math (block) and code (block)', async() => {
		const elem = await fixture(
			html`<d2l-html-block style="width: 650px;" html="${code}
			${mathBlock}"></d2l-html-block>`,
			{ mathjax: { renderLatex: true } }
		);
		await expect(elem).to.be.golden();
	});

});
