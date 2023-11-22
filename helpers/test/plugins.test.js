import { getPlugin, getPlugins, registerPlugin } from '../plugins.js';
import { expect } from '@brightspace-ui/testing';

describe('plugins', () => {

	before(() => {
		registerPlugin('test-plugins', { prop1: 'beer' });
		registerPlugin('test-plugins', { prop1: 'donuts' });
		registerPlugin('test-plugins-sorted', { prop1: 'beer' }, { sort: 2 });
		registerPlugin('test-plugins-sorted', { prop1: 'donuts' }, { sort: 1 });
		registerPlugin('test-plugins-keyed', { prop1: 'beer' }, { key: 'plugin1' });
		registerPlugin('test-plugins-keyed', { prop1: 'donuts' }, { key: 'plugin2' });
	});

	it('getPlugins should return empty array for invalid plugin set key', () => {
		const plugins = getPlugins('invalid-plugin-set-key');
		expect(plugins.length).to.equal(0);
	});

	it('getPlugins should return array of plugins in registration order', () => {
		const plugins = getPlugins('test-plugins');
		expect(plugins.length).to.equal(2);
		expect(plugins[0].prop1).to.equal('beer');
		expect(plugins[1].prop1).to.equal('donuts');
	});

	it('getPlugins should return array of plugins in sort order', () => {
		const plugins = getPlugins('test-plugins-sorted');
		expect(plugins.length).to.equal(2);
		expect(plugins[0].prop1).to.equal('donuts');
		expect(plugins[1].prop1).to.equal('beer');
	});

	it('getPlugins should return array of plugins in new sort order if additional plugins are registered', () => {
		registerPlugin('test-plugins-sorted-add', { prop1: 'beer' }, { sort: 3 });
		registerPlugin('test-plugins-sorted-add', { prop1: 'donuts' }, { sort: 1 });

		let plugins = getPlugins('test-plugins-sorted-add');
		expect(plugins.length).to.equal(2);
		expect(plugins[0].prop1).to.equal('donuts');
		expect(plugins[1].prop1).to.equal('beer');

		registerPlugin('test-plugins-sorted-add', { prop1: 'candy apple' }, { sort: 2 });

		plugins = getPlugins('test-plugins-sorted-add');
		expect(plugins.length).to.equal(3);
		expect(plugins[0].prop1).to.equal('donuts');
		expect(plugins[1].prop1).to.equal('candy apple');
		expect(plugins[2].prop1).to.equal('beer');
	});

	it('getPlugin should return undefined for invalid plugin set key', () => {
		const plugin = getPlugin('invalid-plugin-set-key', 'plugin1');
		expect(plugin).to.equal(undefined);
	});

	it('getPlugin should return undefined for invalid plugin key', () => {
		const plugin = getPlugin('test-plugins-keyed', 'pluginx');
		expect(plugin).to.equal(undefined);
	});

	it('getPlugin should return plugin for specified keys', () => {
		const plugin = getPlugin('test-plugins-keyed', 'plugin1');
		expect(plugin.prop1).to.equal('beer');
	});

});
