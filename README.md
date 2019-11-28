# core

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/core.svg)](https://www.npmjs.org/package/@brightspace-ui/core)
[![NPM downloads](https://img.shields.io/npm/dt/@brightspace-ui/core.svg)](https://www.npmjs.com/package/@brightspace-ui/core)
[![Greenkeeper badge](https://badges.greenkeeper.io/BrightspaceUI/core.svg)](https://greenkeeper.io/)
[![Build status](https://travis-ci.com/BrightspaceUI/core.svg?branch=master)](https://travis-ci.com/BrightspaceUI/core)

A collection of accessible, free, open-source web components for building Brightspace applications.

## Installation

To install from NPM:

```shell
npm install @brightspace-ui/core
```

## Components

* [Buttons](components/button/): normal, primary, icon and subtle buttons
* [Colors](components/colors/): color palette
* [Dialogs](components/dialog/): generic and confirmation dialogs
* [Icons](components/icons/): iconography SVGs and web components
* [Inputs](components/inputs/): text, search, select, checkbox and radio inputs
* [Links](components/link/): link component and styles
* [List](components/list/): list and list-item components
* [Loading Spinner](components/loading-spinner/): loading-spinner components
* [Meter](components/meter/): linear, radial, circle meter web components
* [More/less](components/more-less/): constrain long bits of content
* [Off-screen](components/offscreen/): component and styles for positioning content off-screen
* [Typography](components/typography/): typography styles and components

## Helpers

* [Helpers](helpers/): helpers for composed DOM, unique ids, etc.

## Mixins

* [ArrowKeysMixin](mixins/arrow-keys-mixin.md): manage focus with arrow keys
* [LocalizeMixin](mixins/localize-mixin.md): localize text and format & parse numbers, dates, etc.
* [RtlMixin](mixins/rtl-mixin.md): enable components to define RTL styles
* [VisibleOnAncestorMixin](mixins/visible-on-ancestor-mixin.md): display element on-hover of an ancestor

## Usage

### Structure

`/components/` - Web components for use in your composite components or application (ex. buttons, links, etc)

`/helpers/` - Helpers for use in your web components or mixins (ex. composed DOM helpers)

`/mixins/` - Mixins for use in your web components (ex. localize, RTL, etc)

`/test/` - Index and shared styles for unit tests

`/tools/` - Development tools for building, testing, etc.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

Run `npm run build` once, or any time icon or language files are changed.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

### Running the demos

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

### Testing

To lint:

```shell
npm run lint
```

To run visual-diff tests:

```shell
npm run test:diff
```

To run a subset of visual-diff tests:

```shell
npm run test:diff -- -g some-pattern
```

To update visual-diff goldens:

```shell
npm run test:diff:golden
```

To update the visual-diff goldens in Github using Travis (through triggering a build on the current branch):

```shell
npm run build && npm run test:diff:golden && npm run test:diff:golden:commit
```

To run local unit tests:

```shell
npm run test:local
```

To run a subset of local unit tests, modify your local [index.html](https://github.com/BrightspaceUI/core/blob/master/test/index.html), or start the dev server and navigate to the desired test page.

To run linting, visual-diff, and unit tests:

```shell
npm test
```

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version, create a tag, and trigger a deployment to NPM.
