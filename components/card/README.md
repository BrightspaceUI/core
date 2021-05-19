# Cards

Cards provide concise information and actions as they relate to a single object. They contain content such as images, text, lists, data, rich media, actions, and more.

Used to surface pertinent information, cards make it easy for users to browse information.

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Roll up and emphasize important information to make it easy for users to find.
* Use cards when the user will benefit from a visual representation of the associated item.
* Use cards when the content doesn’t rely heavily on the sort order.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't force the user to click in and out of cards to find information that’s important to the work flow.
* Don't use cards when the user needs to easily compare data from one card to another.
* Don't use cards when the sort order needs to be emphasized – consider a list or table.
* Don't use cards for user generated content.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Card

The `d2l-card` element is a container that provides specific layout using several slots such as `content`, `header`, `footer`, `badge`, and `actions`. It can also be configured as a link for navigation.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/button/button-icon.js';
  import '@brightspace-ui/core/components/card/card.js';
</script>

<d2l-card subtle align-center text="Hydrology" href="https://en.wikipedia.org/wiki/Hydrology" style="width: 245px; height: 300px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg">
  <d2l-button-icon slot="actions" translucent text="unpin" icon="tier1:pin-filled"></d2l-button-icon>
  <div slot="content">
    <div>Hydrology</div>
  </div>
</d2l-card>
```

See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.

## Card Footer Link

The `d2l-card-footer-link` element is an icon link that can be placed in the `footer` slot.

**Note:** See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
</script>

<d2l-card>
  <div slot="content">
    <div>Hydrology</div>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="outcomesLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="5"></d2l-card-footer-link>
  </div>
</d2l-card>
```

## Card Content Title

The `d2l-card-content-title` element is a helper for providing layout/style for a title within the `content` slot.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-content-title.js';
</script>

<d2l-card>
  <div slot="content">
    <d2l-card-content-title>Hydrology</d2l-card-content-title>
  </div>
</d2l-card>
```

## Card Meta Content

The `d2l-card-content-meta` element is a helper for providing layout/style for a meta data within the `content` slot.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-content-meta.js';
</script>

<d2l-card>
  <div slot="content">
    <div>Hydrology</div>
    <d2l-card-content-meta>Some extra content meta data.</d2l-card-content-meta>
  </div>
</d2l-card>
```
