# Description List
A Description List displays static pairs of terms and definitions in a vertical list. In the standard HTML element `dl` these are called "terms" `dt` and "definitions" `dd`.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/description-list/demo/description-list-test.js';
</script>
<d2l-test-dl></d2l-test-dl>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Keep terms short and scannable
* Use terms of similar lengths since definitions are aligned to the longest term
* Use title case for terms and sentence case for definitions
* Adjust the [responsive breakpoint](#responsive-behavior) to suit your content since longer values may need a higher breakpoint
<!-- docs: end dos -->

<!-- docs: start donts -->
* Avoid using multiple description lists on one page
* Don't use empty terms or definitions, both are required
* Don't use colons in the labels, they're unnecessary
* Don't end a definition with a period unless it has multiple sentences
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Responsive Behavior
For very long values, or very small container sizes, the description list can use a vertically stacked layout. By default this happens at a container-width breakpoint of `240px`, but the `breakpoint` property provides flexibility so it can be adjusted to suit your content.

<!-- docs: demo -->
```html
<script type="module">
  import { css, html, LitElement } from 'lit';
  import { descriptionListStyles } from '@brightspace-ui/core/components/description-list/description-list-wrapper.js';

  class TestDescriptionList extends LitElement {

    static get styles() {
      return descriptionListStyles;
    }

    render() {
      return html`
        <d2l-dl-wrapper breakpoint="600">
          <dl>
            <dt>Active Course</dt>
            <dd>Inactive courses are invisible, regardless of start or end dates unless the user’s role has the permission "Can View Inactive Courses"</dd>

            <dt>Start Date</dt>
            <dd>The start date determines when a course becomes available to learners. Users with the "Can View Course Before Start Date" permission are excluded from this restriction.</dd>

            <dt>End Date</dt>
            <dd>The end date determines when a course becomes unavailable to learners. Users with the "Can View Course After End Date" permission are excluded from this restriction.</dd>
          </dl>
        </d2l-dl-wrapper>
      `;
    }

  }
  customElements.define('d2l-test-dl', TestDescriptionList);
</script>
<d2l-test-dl></d2l-test-dl>
```

## Description List Wrapper [d2l-dl-wrapper]

The `d2l-dl-wrapper` component can be combined with `descriptionListStyles` to apply styling and resize behavior to native `dl` elements.

<!-- docs: demo live name:d2l-test-dl display:block -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { descriptionListStyles } from '@brightspace-ui/core/components/description-list/description-list-wrapper.js';

  class TestDescriptionList extends LitElement {

    static get styles() {
      return descriptionListStyles;
    }

    static get properties() {
      return {
        breakpoint: { type: Number },
      }
    }

    render() {
      return html`
        <d2l-dl-wrapper breakpoint="${this.breakpoint}">
          <dl>
            <dt>Course Name</dt>
            <dd>Brightspace 101B</dd>

            <dt>Course Code</dt>
            <dd>BSPC 101B</dd>

            <dt>Start Date</dt>
            <dd>June 14 2022</dd>

            <dt>Semester</dt>
            <dd>2022 Summer</dd>
          </dl>
        </d2l-dl-wrapper>
      `;
    }
  }
  customElements.define('d2l-test-dl', TestDescriptionList);
</script>
<d2l-test-dl></d2l-test-dl>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description | Default Value
|---|---|---|---|
| `breakpoint` | Number | Width for component to use a stacked layout. | 240 |
| `force-stacked` | Boolean | Force the component to always use a stacked layout; will override breakpoint attribute | false |

<!-- docs: end hidden content -->

## Slotted Content [slotted-content]
The `dt` and `dd` elements can contain non-text content such as links or profile images.

<!-- docs: demo -->
```html
<script type="module">
  import { css, html, LitElement } from 'lit';
  import { descriptionListStyles } from '@brightspace-ui/core/components/description-list/description-list-wrapper.js';

  class TestDescriptionList extends LitElement {

    static get styles() {
      return [
        descriptionListStyles, css`
          .user {
            align-items: center;
            display: flex;
            gap: 0.5rem;
          }
          .avatar {
            align-items: center;
            background-color: var(--d2l-color-cinnabar-minus-1);
            border-radius: 0.25rem;
            color: white;
            display: flex;
            font-size: 0.7rem;
            font-weight: 700;
            height: 1.5rem;
            justify-content: center;
            width: 1.5rem;
          }
      `];
    }

    render() {
      return html`
        <d2l-dl-wrapper>
          <dl style="align-items: center">
            <dt>User</dt>
            <dd><div class="user"><div class="avatar">JS</div>John Smith</div></dd>

            <dt>Submitted</dt>
            <dd>Dec 30, 2021 5:34 PM</dd>
          </dl>
        </d2l-dl-wrapper>
      `;
    }

  }
  customElements.define('d2l-test-dl', TestDescriptionList);
</script>
<d2l-test-dl></d2l-test-dl>
```

```html
<d2l-dl-wrapper>
  <dl>
    <dt>User</dt>
    <dd><d2l-user name="John Smith"></d2l-user></dd>

    <dt>Submitted</dt>
    <dd>Dec 30, 2021 5:34 PM</dd>
  </dl>
</d2l-dl-wrapper>
```
