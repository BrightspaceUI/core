# Button Accessibility

In order to make your component usage accessible to screen reader users, please consider using the following attributes where applicable:

| Component | Property | Property Usage | Use Case | Example Usage |
|--|--|--|--|--|
| All `d2l-button`* | `aria-label` | `aria-label` on `button` | When text on button does not provide enough context |  |
| | `aria-expanded` | `aria-expanded` on `button` | Indicate expansion state of collapsible element | `d2l-more-less` |
| | `aria-haspopup` | `aria-haspopup` on `button` | Indicate clicking the button opens a menu | `d2l-dropdown` |
| `d2l-button` | `description` | `aria-label` on `button` | <ul><li>When text on button does not provide enough context</li><li>If `description` AND `aria-label` are provided, `description` is used</li></ul> |  |
| `d2l-button-icon` | `text` | <ul><li>`aria-label` on `button`</li><li>`title` on `button`</li></ul> | <ul><li>Button context</li><li>`text` OR `aria-label` is **REQUIRED**</li><li>If `text` AND `aria-label` are provided, `aria-label` is used for `aria-label` on `button`</li></ul> |  |
| `d2l-button-subtle` | `description` | `aria-label` on `button` | <ul><li>When text on button does not provide enough context</li><li>If `description` AND `aria-label` are provided, `description` is used</li></ul> |  |
