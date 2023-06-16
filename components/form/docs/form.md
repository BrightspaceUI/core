# Form Components

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/form/form.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/inputs/input-textarea.js';

  const button = document.querySelector('d2l-button');
  const form = document.querySelector('d2l-form#root');
  button.addEventListener('click', () => {
    form.submit();
  });
</script>
<style>
  .d2l-form-demo-container {
    margin-bottom: 10px;
  }
</style>
<d2l-form id="root" @d2l-form-submit=${this._onRootSubmit} style="width: 100%;">
  <div class="d2l-form-demo-split-container">
    <d2l-form class="d2l-form-demo-main" @d2l-form-submit=${this._onMainSubmit}>
      <div class="d2l-form-demo-container">
        <d2l-input-text label="Email" name="email" type="email"></d2l-input-text>
      </div>
      <div class="d2l-form-demo-container">
        <d2l-input-textarea label="Description" name="description" rows="2" max-rows="2" required></d2l-input-textarea>
      </div>
    </d2l-form>
  </div>
	<d2l-button primary>Save</d2l-button>
</d2l-form>
```

There are two form components that can be used with our custom elements: `d2l-form` and `d2l-form-native`. These are useful in the following scenarios:
- `d2l-form`: when submitting form data via your own API calls OR when nesting multiple forms within each other
- `d2l-form-native`: when emulating native form element submission

## Form [d2l-form]

The `d2l-form` component can be used to build sections containing interactive controls that are validated and submitted as a group.

It differs from the native HTML `form` element in 4 ways:
1. It supports custom form elements made using the [`FormElementMixin`](./form-element-mixin.md) in addition to native form elements like `input`, `select` and `textarea`.
1. Upon validation, it will display an error summary that contains error messages for any elements that failed validation.
1. `d2l-form` elements can be nested. If a parent form is validated or submitted it will also trigger the corresponding action for descendent `d2l-form`s unless they explicitly opt-out using `no-nesting`. This means that a `d2l-form` will only pass validation if it and all of its nested descendants pass validation.
1. Submission is not handled directly by `d2l-form`. Instead, all form data will be aggregated and passed back to the caller via an event. The caller is then responsible for submitting the data.

If you're looking to emulate native form element submission, `d2l-form-native` may be more appropriate.

<!-- docs: demo code properties name:d2l-form autoSize:false display:block size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/form/form.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';

  const button = document.querySelector('button');
  const form = document.querySelector('d2l-form#root');
  button.addEventListener('click', () => {
    form.submit();
  });

  const formA = document.querySelector('d2l-form#a');
  const formB = document.querySelector('d2l-form#b');

  function handleSubmission(e) {
    const { formData } = e.detail;
    console.log('Form ' + e.target.id + ' submission data ' + JSON.stringify(formData));
  }
  form.addEventListener('d2l-form-submit', (e) => handleSubmission(e));
  formA.addEventListener('d2l-form-submit', (e) => handleSubmission(e));
  formB.addEventListener('d2l-form-submit', (e) => handleSubmission(e));
</script>
<!-- docs: start hidden content -->
<style>
  d2l-input-text {
    padding: 0.5rem 0;
  }
</style>
<!-- docs: end hidden content -->
<d2l-form id="root">
  <select class="d2l-input-select" name="pets" required>
    <option value="">--Please choose an option--</option>
    <option value="porpoise">Porpoise</option>
    <option value="house hippo">House Hippo</option>
    <option value="spiker monkey">Spider Monkey</option>
    <option value="capybara">Capybara</option>
  </select>
  <d2l-form id="a">
    <d2l-input-text label="Name" type="text" name="name" required minlength="4"></d2l-input-text>
  </d2l-form>
  <d2l-form id="b" no-nesting>
    <d2l-input-text required label="Email" name="email" type="email"></d2l-input-text>
  </d2l-form>
  <button name="action" value="save" type="submit">Save</button>
</d2l-form>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `no-nesting` | Boolean, default: `false` | Indicates that the form should opt-out of nesting.<br><br>This means that it will not be submitted or validated if an ancestor form is submitted or validated. However, directly submitting or validating a form with `no-nesting` will still trigger submission and validation for its descendant forms unless they also opt-out using `no-nesting`. |

### Events
- `d2l-form-submit`: Dispatched when the form is submitted. The form data can be obtained from the `detail`'s `formData` property.
- `d2l-form-invalid`: Dispatched when the form fails validation. The error map can be obtained from the `detail`'s `errors` property.
- `d2l-form-dirty`: Dispatched whenever any form element fires an `input` or `change` event. Can be used to track whether the form is dirty or not.
<!-- docs: end hidden content -->

### Methods
- `submit()`: Submits the form. This will first perform validation on all elements within the form including nested `d2l-form` elements.
  - **Note:** If validation succeeds, the form data will be aggregated and passed back to the caller via the `d2l-form-submit` event. It will not be submitted by the form itself.
- `async validate()`: Validates the form and any nested `d2l-form` elements without submitting even if validation succeeds for all elements. Returns a `Map` mapping from an element to the list of error messages associated with it.
  - **Note:** The return value will include elements and errors from both the root form and any nested descendant forms.

### Advanced Usages: Nesting

`d2l-form` supports nesting by default meaning a `d2l-form` will discover descendant `d2l-form` elements. This includes *both*:
1. `d2l-form` elements nested directly within the ancestor form's slot
1. `d2l-form` elements contained within the shadow DOM of elements nested within the ancestor form's slot.

Form nesting will only consider descendants relative to the `d2l-form` that `submit` or `validate` is called on. If `submit` is called on a `d2l-form` element, it will not trigger submission for any ancestor forms, only desdenants.

- **Nested Validation:**
  - When forms are nested, validation is _**atomic**_. This means that validation will only succeed if validation succeeds for the root form and all nested forms. If any form fails validation, none of them will be submitted.
- **Nested Submission:**
  - When forms are nested, submission is _**independent**_. As a result, when nested forms all pass validation, each `d2l-form` will fire its own `d2l-form-submit` event with the data associated with that form.

```html
<script type="module">
  import '@brightspace-ui/core/components/form/form.js';
</script>
<d2l-form id="root">
  <div>
    <d2l-form id="a">
      <d2l-input-text required label="Email" name="email" type="email"></d2l-input-text>
      <select class="d2l-input-select" name="pets" required>
        <option value="">--Please choose an option--</option>
        <option value="porpoise">Porpoise</option>
        <option value="house hippo">House Hippo</option>
        <option value="spiker monkey">Spider Monkey</option>
        <option value="capybara">Capybara</option>
      </select>
      <div>
        <d2l-form id="b">
          <d2l-input-text label="Description" type="text" name="description" required></d2l-input-text>
        </d2l-form>
      </div>
    </d2l-form>
  </div>
  <d2l-form no-nesting id="c">
    <d2l-input-text label="Name" type="text" name="name" required minlength="4"></d2l-input-text>
  </d2l-form>
  <my-ele-with-an-internal-d2l-form id="d">
  </my-ele-with-an-internal-d2l-form>
</d2l-form>
```

#### Example 1
In the above example, calling `submit` on the `#root` form will cause forms `#root`, `#a`, `#b`, and `#d` to be validated and submitted.
- `d2l-form#root` will be submitted because submit was called on it directly.
- `d2l-form#a` will be submitted because it is nested directly within `#root`'s slot.
- `d2l-form#b` will be submitted because it is nested within `#d2l-form#a` which was submitted.
- The `d2l-form` within the shadow root of `#d` will be submitted because it is within the shadow DOM of an element nested directly within `#root`'s slot.
- `d2l-form#c` will _**not**_ be submitted because it has the `no-nesting` attribute despite being nested directly within `#root's` slot.

#### Example 2
In the above example, calling `submit` on form `#a` will cause forms `#a` and `#b` to be validated and submitted.
- `d2l-form#a` will be submitted because submit was called on it directly.
- `d2l-form#b` will be submitted because it is nested directly within `#a`'s slot.
- `d2l-form#root`, `d2l-form#c` and the `d2l-form` within the shadow root of `#d` will _**not**_ be submitted because they are ancestors of `#a` rather than descendants.

## Native Form [d2l-form-native]

The `d2l-form-native` component can be used to build sections containing interactive controls that are validated and submitted as a group.

It differs from the native HTML `form` element in 2 ways:
1. It supports custom form elements made using the [`FormElementMixin`](./form-element-mixin.md) in addition to native form elements like `input`, `select` and `textarea`.
1. Upon validation, it will display an error summary that contains error messages for any elements that failed validation.

If you're looking to submit form data via your own API calls or nest multiple forms within each other, `d2l-form` may be more appropriate.

<!-- docs: demo code properties name:d2l-form-native autoSize:false display:block size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/form/form-native.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';

  const button = document.querySelector('button');
  const form = document.querySelector('d2l-form-native');
  button.addEventListener('click', () => {
    form.submit();
  });

  function handleSubmission(e) {
    const { formData } = e.detail;
    const email = formData.get('email');
    const pets = formData.get('pets');
    console.log('Form submission data: email = ' + email + ', pets = ' + pets);
  }
  form.addEventListener('formdata', (e) => handleSubmission(e));
</script>
<d2l-form-native>
  <d2l-input-text required label="Email" name="email" type="email"></d2l-input-text>
  <select class="d2l-input-select" name="pets" required>
    <option value="">--Please choose an option--</option>
    <option value="porpoise">Porpoise</option>
    <option value="house hippo">House Hippo</option>
    <option value="spiker monkey">Spider Monkey</option>
    <option value="capybara">Capybara</option>
  </select>
  <button name="action" value="save" type="submit">Save</button>
</d2l-form-native>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `action` | String | The URL that processes the form submission. |
| `enctype` | default: `"application/x-www-form-urlencoded"`<br>`"multipart/form-data"`<br>`"text/plain"` | If the value of the method attribute is post, enctype is the MIME type of the form submission. |
| `method` | default: `"get"`<br>`"post"` | The URL that processes the form submission. |
| `target` | default: `"_self"`<br>`"_blank"`<br>`"_parent"`<br>`"_top"` | Indicates where to display the response after submitting the form. |
| `track-changes` | Boolean, default: `false` | Indicates that the form should interrupt and warn on navigation if the user has unsaved changes. |

### Events
- `submit`: Dispatched when the form is submitted. Cancelling this event will prevent form submission.
- `formdata`: Dispatched after the entry list representing the form's data is constructed. This happens when the form is submitted just prior to submission. The form data can be obtained from the `detail`'s `formData` property.
- `d2l-form-dirty`: Dispatched whenever any form element fires an `input` or `change` event. Can be used to track whether the form is dirty or not.
<!-- docs: end hidden content -->

### Methods
- `submit()`: Submits the form to the server. This will first perform validation on all elements within the form. Submission will only happen if validation succeeds.
- `requestSubmit(submitter)`: Requests that the form be submitted using the specified submit button and its corresponding configuration. A `button`'s value is only submitted if that button is both part of the form and the `submitter`.
- `async validate()`: Validates the form without submitting even if validation succeeds. This returns a `Map` mapping from an element to the list of error messages associated with it.
