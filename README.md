# core

[![Greenkeeper badge](https://badges.greenkeeper.io/BrightspaceUI/core.svg)](https://greenkeeper.io/)

A collection of core UI components.

## Installation

Coming soon!

## Components

* [Buttons](components/button/): normal, primary, icon and subtle buttons
* [Colors](components/colors/): color palette
* [Icons](components/icons/): iconography SVGs and web components
* [Meter](components/meter/): linear, radial, circle meter web components.
* [More/less](components/more-less/): constrain long bits of content
* [Typography](components/typography/): typography styles and components

## Usage

### Structure

`/components/` - Web components for use in your composite components or application (ex. buttons, links, etc)

`/helpers/` - Helpers for use in your web components or mixins (ex. composed DOM helpers)

`/mixins/` - Mixins for use in your web components (ex. localize, RTL, etc)

`/test/` - Index and shared styles for unit tests

`/tools/` - Development tools for building, testing, etc.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

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

To run local unit tests:

```shell
npm run test:local
```

To run a subset of local unit tests, modify your local [index.html](https://github.com/BrightspaceUI/core/blob/master/test/index.html), or start the dev server and navigate to the desired test page.

To run linting, visual-diff, and unit tests:

```shell
npm test
```
