import './trim-whitespace.test-helper.js';
import { aTimeout, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const getSimplifiedText = elem => elem.getText().replace(/[ \n\t]+/gi, ' ');
const makeRunner = (settings = {}) => fixture(html`
	<whitespace-tester-runner
		span-text="${ifDefined(settings.spanText)}"
		?enable-span-content="${settings.enableSpanContent}"
		?enable-span-element="${settings.enableSpanElement}"
		slotted-text="${ifDefined(settings.slottedText)}"
		?enable-slotted-element="${settings.enableSlottedElement}"
		?enable-nested="${settings.enableNested}"
		?enable-no-trim="${settings.enableNoTrim}"
		?trim-whitespace-deep="${settings.trimWhitespaceDeep}"
		test-type="${ifDefined(settings.testType)}"
	></whitespace-tester-runner>
`);

const fullSettings = {
	spanText: ' (1 Span Text 1) ',
	enableSpanContent: true,
	enableSpanElement: true,
	slottedText: ' (4 Slotted Text 4) ',
	enableSlottedElement: true,
	enableNested: true,
	enableNoTrim: true,
};

const propsExpected = {
	all: {
		untrimmed: '| (1 Span Text 1) | (2 Span Content 2) | (3 Span Element 3) | (4 Slotted Text 4) | (5 Slotted Element 5) | (A1 Nested Span Text A1) | (A2 Nested Slotted Element A2) | (B1 No Trim B1) | (B2 Yes Trim B2) |',
		shallow: '|(1 Span Text 1)|(2 Span Content 2)|(3 Span Element 3)|(4 Slotted Text 4)|(5 Slotted Element 5)| (A1 Nested Span Text A1) |(A2 Nested Slotted Element A2)| (B1 No Trim B1) |(B2 Yes Trim B2)|',
		deep: '|(1 Span Text 1)|(2 Span Content 2)|(3 Span Element 3)|(4 Slotted Text 4)|(5 Slotted Element 5)|(A1 Nested Span Text A1)|(A2 Nested Slotted Element A2)| (B1 No Trim B1) |(B2 Yes Trim B2)|',
	},
	spanText: {
		untrimmed: '| (1 Span Text 1) | | | | |', shallow: '|(1 Span Text 1)|||||', deep: '|(1 Span Text 1)|||||',
	},
	enableSpanContent: {
		untrimmed: '| | (2 Span Content 2) | | | |', shallow: '||(2 Span Content 2)||||', deep: '||(2 Span Content 2)||||',
	},
	enableSpanElement: {
		untrimmed: '| | | (3 Span Element 3) | | |', shallow: '|||(3 Span Element 3)|||', deep: '|||(3 Span Element 3)|||',
	},
	slottedText: {
		untrimmed: '| | | | (4 Slotted Text 4) | |', shallow: '||||(4 Slotted Text 4)||', deep: '||||(4 Slotted Text 4)||',
	},
	enableSlottedElement: {
		untrimmed: '| | | | | (5 Slotted Element 5) |', shallow: '|||||(5 Slotted Element 5)|', deep: '|||||(5 Slotted Element 5)|',
	},
	enableNested: {
		untrimmed: '| | | | | | (A1 Nested Span Text A1) | (A2 Nested Slotted Element A2) |', shallow: '|||||| (A1 Nested Span Text A1) |(A2 Nested Slotted Element A2)|', deep: '||||||(A1 Nested Span Text A1)|(A2 Nested Slotted Element A2)|',
	},
	enableNoTrim: {
		untrimmed: '| | | | | | (B1 No Trim B1) | (B2 Yes Trim B2) |', shallow: '|||||| (B1 No Trim B1) |(B2 Yes Trim B2)|', deep: '|||||| (B1 No Trim B1) |(B2 Yes Trim B2)|',
	},
};

describe('trim-whitespace', () => {

	[
		{ testType: 'untrimmed' },
		{ testType: 'mixin', deep: false },
		{ testType: 'mixin', deep: true },
		{ testType: 'directive', deep: false },
		{ testType: 'directive', deep: true },
	].forEach(({ testType, deep }) => {
		describe(`${testType}${deep ? ' deep' : ''}`, () => {

			Object.keys(propsExpected).forEach(prop => {
				const propsExpectedIndex = testType === 'untrimmed' ? 'untrimmed' : deep ? 'deep' : 'shallow';
				const expected = propsExpected[prop][propsExpectedIndex];
				const props = prop === 'all' ? fullSettings : { [prop]: fullSettings[prop] };

				it(`setting ${prop} initially should match expected text`, async() => {
					const elem = await makeRunner({ testType, trimWhitespaceDeep: deep, ...props });
					expect(getSimplifiedText(elem)).to.equal(expected);
				});

				it(`setting ${prop} in an update should match expected text`, async() => {
					const elem = await makeRunner({ testType, trimWhitespaceDeep: deep });
					Object.keys(props).forEach(prop => elem[prop] = props[prop]);
					await aTimeout();

					expect(getSimplifiedText(elem)).to.equal(expected);
				});

			});

		});
	});

});
