import { isInteractive, isInteractiveInComposedPath } from '../interactive.js';
import { expect } from '@brightspace-ui/testing';

describe('interactive', () => {

	describe('isInteractive', () => {
		it('should return true for interactive elements', () => {
			const ele = document.createElement('button');
			expect(isInteractive(ele)).to.be.true;
		});

		it('should return false for non-interactive elements', () => {
			const ele = document.createElement('div');
			expect(isInteractive(ele)).to.be.false;
		});

		it('should return true for interactive roles', () => {
			const ele = document.createElement('div');
			ele.setAttribute('role', 'button');
			expect(isInteractive(ele)).to.be.true;
		});

		it('should return false for non-interactive roles', () => {
			const ele = document.createElement('div');
			ele.setAttribute('role', 'non-interactive-role');
			expect(isInteractive(ele)).to.be.false;
		});

		it('should return true for anchor elements with href', () => {
			const ele = document.createElement('a');
			ele.setAttribute('href', '#');
			expect(isInteractive(ele)).to.be.true;
		});

		it('should return false for anchor elements without href', () => {
			const ele = document.createElement('a');
			expect(isInteractive(ele)).to.be.false;
		});

		it('should return true for elements with custom interactive elements', () => {
			const ele = document.createElement('custom-element');
			const elems = { 'custom-element': true };
			expect(isInteractive(ele, elems)).to.be.true;
		});

		it('should return false for elements without custom interactive elements', () => {
			const ele = document.createElement('custom-element');
			const elems = { 'other-element': true };
			expect(isInteractive(ele, elems)).to.be.false;
		});

		it('should return true for elements with custom interactive roles', () => {
			const ele = document.createElement('custom-element');
			ele.setAttribute('role', 'custom-role');
			const roles = { 'custom-role': true };
			expect(isInteractive(ele, null, roles)).to.be.true;
		});

		it('should return false for elements without custom interactive roles', () => {
			const ele = document.createElement('custom-element');
			ele.setAttribute('role', 'custom-role');
			const roles = { 'other-role': true };
			expect(isInteractive(ele, null, roles)).to.be.false;
		});
	});

	describe('isInteractiveInComposedPath', () => {
		it('should return true if an interactive element is found', () => {
			const ele = document.createElement('button');
			const path = [ ele ];
			expect(isInteractiveInComposedPath(path)).to.be.true;
		});

		it('should return false if no interactive elements are found', () => {
			const ele = document.createElement('div');
			const path = [ ele ];
			expect(isInteractiveInComposedPath(path)).to.be.false;
		});

		it('should return true if interactive element is found in the path', () => {
			const ele1 = document.createElement('div');
			const ele2 = document.createElement('button');
			const path = [ ele1, ele2 ];
			expect(isInteractiveInComposedPath(path)).to.be.true;
		});

		it('should return true if options elements are passed and an interactive element is found', () => {
			const ele1 = document.createElement('div');
			const ele2 = document.createElement('d2l-button');
			const path = [ ele1, ele2 ];
			const options = { elements: { 'd2l-button': true } };
			expect(isInteractiveInComposedPath(path, null, options)).to.be.true;
		});

		it('should return true if options roles are passed and an interactive role is found', () => {
			const ele1 = document.createElement('div');
			const ele2 = document.createElement('div');
			ele2.setAttribute('role', 'h2');
			const path = [ ele1, ele2 ];
			const options = { roles: { 'h2': true } };
			expect(isInteractiveInComposedPath(path, null, options)).to.be.true;
		});

		it('should return false if predicate is matched', () => {
			const ele1 = document.createElement('div');
			const ele2 = document.createElement('div');
			ele2.setAttribute('id', 'test-id');
			const ele3 = document.createElement('button');
			const path = [ ele1, ele2, ele3 ];
			const isPrimaryAction = (elem) => elem.id === 'test-id';
			expect(isInteractiveInComposedPath(path, isPrimaryAction)).to.be.false;
		});
	});

});
