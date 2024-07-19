# Cards

Cards provide concise information and actions as they relate to a single object. They contain content such as images, text, lists, data, rich media, actions, and more.

Used to surface pertinent information, cards make it easy for users to browse information.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<d2l-card align-center text="Biology" align-center style="width: 245px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/7905e442-f009-46f6-8586-2c273a7c0158/banner-narrow-low-density-max-size.jpg">
  <div slot="content">
    <div>Biology</div>
    <d2l-card-content-meta>
      <d2l-object-property-list>
        <d2l-object-property-list-item text="Science"></d2l-object-property-list-item>
        <d2l-object-property-list-item text="Grade 11"></d2l-object-property-list-item>
      </d2l-object-property-list>
    </d2l-card-content-meta>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="discussionsLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="2">
      <d2l-tooltip slot="tooltip" for="discussionsLink1">Discussions</d2l-tooltip>
    </d2l-card-footer-link>
    <d2l-card-footer-link id="assignmentsLink1" icon="tier1:assignments" text="Assignments" secondary-text="1">
      <d2l-tooltip slot="tooltip" position="top" style="width: 100%;" for="assignmentsLink1">You have 1 assignments due tomorrow.</d2l-tooltip>
    </d2l-card-footer-link>
  </div>
</d2l-card>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Roll up and emphasize important information to make it easy for users to find
* Use cards when the user will benefit from a visual representation of the associated item
* Use cards when the content doesn’t rely heavily on the sort order
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't force the user to click in and out of cards to find information that’s important to the work flow
* Don't use cards
  * when the user needs to easily compare data from one card to another
  * when the sort order needs to be emphasized – consider a list or table
  * for user generated content
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Composition

Cards are composed of 3 sections. Each card will have a content section but is not required to have a header or footer.

<!-- docs: demo size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<style>
  .container {
    display: flex;
  }
  .title_container {
    margin-right: 50px;
  }
  .title_container > div {
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }
</style>

<div class="container">
  <div class="title_container">
    <div id="header" class="active" style="height: 155px;">
      Header (optional)
    </div>
    <div id="content" style="height: 105px;">
      Content (required)
    </div>
    <div id="footer">
      Footer (optional)
    </div>
  </div>
  <d2l-card align-center text="Biology" align-center style="width: 245px;">
    <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/7905e442-f009-46f6-8586-2c273a7c0158/banner-narrow-low-density-max-size.jpg">
    <div slot="content">
      <div>Biology</div>
      <d2l-card-content-meta>
        <d2l-object-property-list>
          <d2l-object-property-list-item text="Science"></d2l-object-property-list-item>
          <d2l-object-property-list-item text="Grade 11"></d2l-object-property-list-item>
        </d2l-object-property-list>
      </d2l-card-content-meta>
    </div>
    <div slot="footer">
      <d2l-card-footer-link id="discussionsLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="2">
        <d2l-tooltip slot="tooltip" for="discussionsLink1">Discussions</d2l-tooltip>
      </d2l-card-footer-link>
      <d2l-card-footer-link id="assignmentsLink1" icon="tier1:assignments" text="Assignments" secondary-text="1">
        <d2l-tooltip slot="tooltip" position="top" style="width: 100%;" for="assignmentsLink1">You have 1 assignments due tomorrow.</d2l-tooltip>
      </d2l-card-footer-link>
    </div>
  </d2l-card>
</div>
```

## Card [d2l-card]

The `d2l-card` element is a container that provides specific layout using several slots such as `content`, `header`, `footer`, `badge`, and `actions`. It can also be configured as a link for navigation.

<!-- docs: demo code properties name:d2l-card sandboxTitle:'Card' size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<d2l-card align-center text="Biology" align-center href="#" style="width: 245px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/7905e442-f009-46f6-8586-2c273a7c0158/banner-narrow-low-density-max-size.jpg">
  <div slot="content">
    <div>Biology</div>
    <d2l-card-content-meta>
      <d2l-object-property-list>
        <d2l-object-property-list-item text="Science"></d2l-object-property-list-item>
        <d2l-object-property-list-item text="Grade 11"></d2l-object-property-list-item>
      </d2l-object-property-list>
    </d2l-card-content-meta>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="discussionsLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="2">
      <d2l-tooltip slot="tooltip" for="discussionsLink1">Discussions</d2l-tooltip>
    </d2l-card-footer-link>
    <d2l-card-footer-link id="assignmentsLink1" icon="tier1:assignments" text="Assignments" secondary-text="1">
      <d2l-tooltip slot="tooltip" position="top" style="width: 100%;" for="assignmentsLink1">You have 1 assignments due tomorrow.</d2l-tooltip>
    </d2l-card-footer-link>
  </div>
</d2l-card>
```

<!-- docs: start hidden content -->
### Slots

| Slot | Type | Description |
|--|--|--|
| `content` | required | Primary content such as title and supplementary info (no actionable elements) |
| `actions` | optional | Buttons and dropdown openers to be placed in top right corner of header |
| `badge` | optional | Badge content, such as a profile image or status indicator |
| `footer` | optional | Footer content, such secondary actions |
| `header` | optional | Header content, such as course image (no actionable elements) |

### Properties:

| Property | Type | Description |
|--|--|--|
| `align-center` | Boolean | Style the card's content and footer as centered horizontally |
| `download` | Boolean | Download a URL instead of navigating to it |
| `href` | String | Location for the primary action/navigation |
| `rel` | String | Relationship of the target object to the link object |
| `subtle` | Boolean | Subtle aesthetic on non-white backgrounds |
| `target` | String | Where to display the linked URL |
| `text` | String | Accessible text for the card (will be announced when AT user focuses) |

See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.
<!-- docs: end hidden content -->

## Card content: Title [d2l-card-content-title]

The `d2l-card-content-title` element is a helper for providing layout/style for a title within the `content` slot.

<!-- docs: demo code properties name:d2l-card-content-title sandboxTitle:'Card Content - Title' size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
  import '@brightspace-ui/core/components/card/card-content-title.js';
</script>

<d2l-card align-center text="Biology" align-center href="#" style="width: 245px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/7905e442-f009-46f6-8586-2c273a7c0158/banner-narrow-low-density-max-size.jpg">
  <div slot="content">
    <d2l-card-content-title>Biology</d2l-card-content-title>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="discussionsLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="2">
      <d2l-tooltip slot="tooltip" for="discussionsLink1">Discussions</d2l-tooltip>
    </d2l-card-footer-link>
    <d2l-card-footer-link id="assignmentsLink1" icon="tier1:assignments" text="Assignments" secondary-text="1">
      <d2l-tooltip slot="tooltip" position="top" style="width: 100%;" for="assignmentsLink1">You have 1 assignments due tomorrow.</d2l-tooltip>
    </d2l-card-footer-link>
  </div>
</d2l-card>
```

## Card Content: Meta  [d2l-card-content-meta]

The `d2l-card-content-meta` element is a helper for providing layout/style for a meta data within the `content` slot.

<!-- docs: demo code properties name:d2l-card-content-meta sandboxTitle:'Card Content - Meta' size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-content-meta.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>
<d2l-card align-center text="Biology" align-center href="#" style="width: 245px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/7905e442-f009-46f6-8586-2c273a7c0158/banner-narrow-low-density-max-size.jpg">
  <div slot="content">
    <div>Biology</div>
    <d2l-card-content-meta>
      <d2l-object-property-list>
        <d2l-object-property-list-item text="Science"></d2l-object-property-list-item>
        <d2l-object-property-list-item text="Grade 11"></d2l-object-property-list-item>
      </d2l-object-property-list>
    </d2l-card-content-meta>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="discussionsLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="2">
      <d2l-tooltip slot="tooltip" for="discussionsLink1">Discussions</d2l-tooltip>
    </d2l-card-footer-link>
    <d2l-card-footer-link id="assignmentsLink1" icon="tier1:assignments" text="Assignments" secondary-text="1">
      <d2l-tooltip slot="tooltip" position="top" style="width: 100%;" for="assignmentsLink1">You have 1 assignments due tomorrow.</d2l-tooltip>
    </d2l-card-footer-link>
  </div>
</d2l-card>
```

## Card Footer: Link [d2l-card-footer-link]

The `d2l-card-footer-link` element is an icon link that can be placed in the `footer` slot.

<!-- docs: demo code properties name:d2l-card-footer-link sandboxTitle:'Card Content - Link' size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list.js';
  import '@brightspace-ui/core/components/object-property-list/object-property-list-item.js';
  import '@brightspace-ui/core/components/tooltip/tooltip.js';
</script>

<d2l-card align-center text="Biology" align-center href="#" style="width: 245px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="https://s.brightspace.com/course-images/images/7905e442-f009-46f6-8586-2c273a7c0158/banner-narrow-low-density-max-size.jpg">
  <div slot="content">
    <div>Biology</div>
    <d2l-card-content-meta>
      <d2l-object-property-list>
        <d2l-object-property-list-item text="Science"></d2l-object-property-list-item>
        <d2l-object-property-list-item text="Grade 11"></d2l-object-property-list-item>
      </d2l-object-property-list>
    </d2l-card-content-meta>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="discussionsLink1" icon="tier1:outcomes" text="Outcomes" secondary-text="2">
      <d2l-tooltip slot="tooltip" for="discussionsLink1">Discussions</d2l-tooltip>
    </d2l-card-footer-link>
    <d2l-card-footer-link id="assignmentsLink1" icon="tier1:assignments" text="Assignments" secondary-text="1">
      <d2l-tooltip slot="tooltip" position="top" style="width: 100%;" for="assignmentsLink1">You have 1 assignments due tomorrow.</d2l-tooltip>
    </d2l-card-footer-link>
  </div>
</d2l-card>
```

<!-- docs: start hidden content -->
### Slots

| Slot | Type | Description |
|--|--|--|
| `tooltip` | required | The tooltip for the footer link. |

### Properties:

| Property | Type | Description |
|--|--|--|
| `icon` | String, required | Preset icon key (ex. "tier1:gear") |
| `text` | String, required | Accessible text for the link (not visible, gets announced when user focuses) |
| `download` | Boolean | Download a URL instead of navigating to it |
| `href` | String | Location for the primary action/navigation |
| `rel` | String | Relationship of the target object to the link object |
| `secondary-count` | Number | Count to display as a superscript on the icon |
| `secondary-count-type` | String | Controls the style of the secondary count bubble; options are `notification` and `count` |
| `secondary-count-max-digits` | Number | Overrides the default maximum digits of the secondary count bubble (2 for `notification` and no limit for `count` type) |
| `target` | String | Where to display the linked URL |

See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.

## Future Improvements

* scroll API for the dialog content (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
