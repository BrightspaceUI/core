import { restore, stub } from 'sinon';
import { expect } from '@brightspace-ui/testing';
import { formatCodeElement } from '../prism.js';

describe('prism', () => {

	afterEach(() => restore());

	it('formats supported languages', async() => {
		const code = document.createElement('code');
		code.className = 'language-javascript';
		code.textContent = 'const answer = 42;';

		await formatCodeElement(code);

		expect(code.dataset.language).to.equal('JavaScript');
		expect(code.querySelector('.token.keyword')).to.have.text('const');
	});

	it('falls back to plain for unsupported languages', async() => {
		const code = document.createElement('code');
		code.className = 'language-unsupported';
		code.textContent = 'const answer = 42;';
		const appendChild = stub(document.head, 'appendChild').callThrough();

		await formatCodeElement(code);

		expect(appendChild.called).to.be.false;
		expect(code.dataset.language).to.be.undefined;
		expect(code.querySelector('.token')).to.be.null;
	});

	it('loads unsupported languages when all languages are allowed', async() => {
		const code = document.createElement('code');
		code.className = 'language-test-language';
		code.textContent = 'test';
		const appendChild = stub(document.head, 'appendChild').callsFake(node => {
			expect(node.src).to.match(/\/prism-test-language\.min\.js$/);
			node.onload();
			return node;
		});

		await formatCodeElement(code, { allowAllLanguages: true });

		expect(appendChild.calledOnce).to.be.true;
		expect(code.dataset.language).to.be.undefined;
	});

	it('loads the bash language for the shell alias', async() => {
		const code = document.createElement('code');
		code.className = 'language-shell';
		code.textContent = 'echo';
		const appendChild = stub(document.head, 'appendChild').callsFake(node => {
			expect(node.src).to.match(/\/prism-bash\.min\.js$/);
			node.onload();
			return node;
		});

		await formatCodeElement(code, { allowAllLanguages: true });

		expect(appendChild.calledOnce).to.be.true;
	});

	it('uses an unsupported language (html) already registered by Prism', async() => {
		const code = document.createElement('code');
		code.className = 'language-html';
		code.textContent = '<p>Hello</p>';
		const appendChild = stub(document.head, 'appendChild').callThrough();

		await formatCodeElement(code, { allowAllLanguages: true });

		expect(appendChild.called).to.be.false;
		expect(code.querySelector('.token.tag')).to.exist;
	});

});
