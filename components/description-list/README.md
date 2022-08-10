# Description List
A Description List displays information in a
vertical list of key-value pairs. Common usages could include terms & definitions, or fields & values.

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
* Do this
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't do this
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Responsive Behavior
When the component width is less than the `breakpoint` property, the side-by-side pairs will appear in a stacked layout.

<!-- docs: demo -->
```html
<script type="module">
  import { css, html, LitElement } from 'lit';
  import { descriptionListStyles } from '@brightspace-ui/core/components/description-list/description-list-wrapper.js';

  class TestDescriptionList extends LitElement {

    static get styles() {
      // return [ descriptionListStyles, css`:host { width: 500px }`];
      return descriptionListStyles;
    }

    render() {
      return html`
        <d2l-dl-wrapper breakpoint="600">
          <dl>
            <dt>Course Code That Represents The Course as a Short String</dt>
            <dd>A short string that represents the course, often with important information such as section or room number.</dd>

            <dt>Availability Dates</dt>
            <dd>The start and end date for the course. Learners can't access courses outside these dates.</dd>
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

The `d2l-dl-wrapper` can be combined with `descriptionListStyles` to apply styling and resize behavior to native `dl` elements.

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
            <dt>Course Code That Represents The Course as a Short String</dt>
            <dd>A short string that represents the course, often with important information such as section or room number.</dd>

            <dt>Availability Dates</dt>
            <dd>The start and end date for the course. Learners can't access courses outside these dates.</dd>
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
| `breakpoint` | Number | Width for component to use a stacked layout. | 200 |

<!-- docs: end hidden content -->

## Slotted Content [slotted-content]
The `dt` and `dd` elements can contain any html content.

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
