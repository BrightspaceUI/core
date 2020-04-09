# Templates
Page templates to provide common ways to arrange content on a page

## Primary-Secondary
Two Panel (primary and secondary) page template with header and optional footer

Use this template when: 
- There are primary and secondary elements on the page
- The user may need to see the primary and secondary elements at the same time 
 
Mental Models and Page Structure: 
- The page includes basic settings (primary) and advanced settings (secondary) 
- There is a primary object which users are modifying or supplementing with secondary tools/settings/options

>
> - [x] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [x] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [x] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [x] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [x] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [x] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [x] Demo page
> - [x] README documentation

### Usage
```html
<script type="module">
  import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
</script>

<d2l-template-primary-secondary>
    <div slot="header">Header</div>
    <div slot="primary">The primary slot</div>
    <div slot="secondary">The secondary slot</div>
    <div slot="footer">Footer</div>
</d2l-template-primary-secondary>
```

If no nodes are assigned to the `footer` slot, the footer is hidden.

**Note:** this template automatically includes `<header>`, `<main>`, `<aside>` and `<footer>` elements, so there's no need to include them inside the various slots.

**Properties:**
- `widthType` (string, default: `fullscreen`): The width that the template content will be constrained to. Accepts `fullscreen` or `normal`. Normal constrains width to `1230px`. 

## Future Enhancements

- Optional draggable divider between the primary and secondary panels
- For smaller devices, the primary and secondary panels will move into collapsible drawers

Looking for an enhancement not listed here? Create a GitHub issue!
