export default {
	"components.alert.close": "انتباہ بند کریں",
	"components.backdrop-loading.loadingAnnouncement": "لوڈ ہو رہا ہے۔",
	"components.backdrop-loading.loadingCompleteAnnouncement": "لوڈنگ مکمل ہو گئی۔",
	"components.backdrop-stale-overlay.message": "This data is out of date.",
	"components.breadcrumbs.breadcrumb": "بریڈ کرمب",
	"components.button-add.addItem": "آئٹم شامل کریں",
	"components.button-copy.copied": "نقل کی گئی!",
	"components.button-copy.error": "کاپی ناکام ہوگئی۔ دوبارہ کوشش کریں، یا دستی طور پر کاپی کریں۔",
	"components.button-split.otherOptions": "دیگر اختیارات",
	"components.calendar.hasEvents": "واقعات موجود ہیں۔",
	"components.calendar.notSelected": "منتخب نہیں کیا گیا۔",
	"components.calendar.selected": "منتخب شدہ۔",
	"components.calendar.show": "{month} شو کریں",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "اس ڈائیلاگ کو بند کریں",
	"components.dialog.critical": "انتہائی اہم!",
	"components.dropdown.close": "بند کریں",
	"components.filter.activeFilters": "فعال فلٹرز:",
	"components.filter.additionalContentTooltip": "اس <b>فہرست کی شے کے اندر فوکس</b> منتقل کرنے کے لئے بائیں/دائیں تیر کی چابیاں استعمال کریں",
	"components.filter.clear": "صاف کریں",
	"components.filter.clearAll": "سب کو صاف کریں",
	"components.filter.clearAllAnnounce": "تمام فلٹرز صاف کرنا",
	"components.filter.clearAllAnnounceOverride": "اس کے لیے تمام فلٹرز صاف کرنا: {filterText}",
	"components.filter.clearAllDescription": "تمام فلٹرز صاف کریں",
	"components.filter.clearAllDescriptionOverride": "اس کے لیے تمام فلٹرز صاف کریں: {filterText}",
	"components.filter.clearAnnounce": "اس کے لیے فلٹرز صاف کرنا: {filterName}",
	"components.filter.clearDescription": "اس کے لیے فلٹرز صاف کریں: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {کوئی فلٹر لاگو نہیں کیا گیا ہے۔}
			one {{number} فلٹر لاگو کیا گیا ہے۔}
			other {{number} فلٹرز لاگو کیے گئے ہیں۔}
		}`,
	"components.filter.filters": "فلٹرز",
	"components.filter.loading": "فلٹرز لوڈ کر رہا ہے",
	"components.filter.noFilters": "کوئی فلٹر دستیاب نہیں ہے",
	"components.filter.searchResults":
		`{number, plural,
			=0 {تلاش کے نتائج نہیں}
			one {{number} تلاش کا نتیجہ}
			other {{number} تلاش کے نتائج}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}۔ منتخب کردہ فلٹرز پہلے ظاہر ہوتے ہیں۔",
	"components.filter.singleDimensionDescription": "فلٹر کریں: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {آج}
			one {آخری {num} دن}
			other {آخری {num} دن}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {آخری گھنٹہ}
			other {آخری {num} گھنٹے}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "پچھلے {num} مہینے",
	"components.filter-dimension-set-date-time-range-value.label": "{text} ، تاریخوں کو منتخب کرنے کے لئے توسیع کریں",
	"components.filter-dimension-set-date-time-range-value.text": "اپنی مرضی کے مطابق تاریخ کی حد",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} سے {endValue} تک",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "{endValue} سے پہلے",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "{startValue} کے بعد",
	"components.form-element.defaultError": "{label} ناجائز ہے",
	"components.form-element.defaultFieldLabel": "فیلڈ",
	"components.form-element.input.email.typeMismatch": "ای میل درست نہیں ہے",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {نمبر {min} سے زیادہ اور {max} سے کم ہونا ضروری ہے۔}
				other {نمبر {min} سے زیادہ اور {max} سے کم یا برابر ہونا ضروری ہے۔}
			}}
			other {{maxExclusive, select,
				true {نمبر {min} سے زیادہ یا برابر اور {max} سے کم ہونا ضروری ہے۔}
				other {نمبر {min} سے زیادہ یا برابر اور {max} سے کم یا برابر ہونا ضروری ہے۔}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {نمبر {max} سے کم ہونا چاہیے۔}
			other {نمبر {max} سے کم یا برابر ہونا چاہیے۔}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {نمبر {min} سے زیادہ ہونا چاہیے۔}
			other {نمبر {min} سے زیادہ یا برابر ہونا ضروری ہے۔}
		}`,
	"components.form-element.input.text.tooShort": "{label} کم از کم {minlength} حروف پر مشتمل ہونا ضروری ہے",
	"components.form-element.input.url.typeMismatch": "URL درست نہیں ہے",
	"components.form-element.valueMissing": "{label} درکار ہے",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {آپ کی جمع کردہ معلومات میں {count} خرابی پائی گئی}
			other {آپ کی جمع کردہ معلومات میں {count} خرابیاں پائی گئیں}
		}`,
	"components.form-error-summary.text": "غلطی کی تفصیلات کو ٹوگل کریں",
	"components.input-color.backgroundColor": "پس منظر کا رنگ",
	"components.input-color.foregroundColor": "پیش منظر کا رنگ",
	"components.input-color.none": "کوئی نہیں",
	"components.input-date.clear": "صاف کریں",
	"components.input-date.errorMaxDateOnly": "تاریخ لازمی طور پر {maxDate} یا اس سے پہلے ہونی چاہیے",
	"components.input-date.errorMinDateOnly": "تاریخ کو {minDate} پر یا اس کے بعد ہونا چاہیے",
	"components.input-date.errorOutsideRange": "تاریخ کو {minDate} اور {maxDate} کے درمیان ہونا چاہیے",
	"components.input-date.now": "اب",
	"components.input-date.openInstructions": "تاریخ کی شکل {format} استعمال کریں۔ منی کیلنڈر تک رسائی حاصل کرنے کے لیے نیچے تیر کو دبائیں یا انٹر دبائیں۔",
	"components.input-date.revert": "{label} کو سابقہ قیمت پر واپس کردیا گیا ہے۔",
	"components.input-date.today": "آج",
	"components.input-date.useDateFormat": "تاریخ کی شکل {format} استعمال کریں۔",
	"components.input-date-range.endDate": "اینڈ ڈیٹ",
	"components.input-date-range.errorBadInput": "{startLabel} کو {endLabel} سے پہلے ہونا چاہیے",
	"components.input-date-range.interactive-label": "تاریخ کی حد ان پٹ",
	"components.input-date-range.startDate": "اسٹارٹ ڈیٹ",
	"components.input-date-time.date": "تاریخ",
	"components.input-date-time.errorMaxDateOnly": "تاریخ لازمی طور پر {maxDate} یا اس سے پہلے ہونی چاہیے",
	"components.input-date-time.errorMinDateOnly": "تاریخ کو {minDate} پر یا اس کے بعد ہونا چاہیے",
	"components.input-date-time.errorOutsideRange": "تاریخ کو {minDate} اور {maxDate} کے درمیان ہونا چاہیے",
	"components.input-date-time.time": "ٹائم",
	"components.input-date-time-range.endDate": "اینڈ ڈیٹ",
	"components.input-date-time-range.errorBadInput": "{startLabel} کو {endLabel} سے پہلے ہونا چاہیے",
	"components.input-date-time-range.interactive-label": "تاریخ اور ٹائم رینج ان پٹ",
	"components.input-date-time-range.startDate": "اسٹارٹ ڈیٹ",
	"components.input-date-time-range-to.to": "تک",
	"components.input-number.hintDecimalDuplicate": "اس نمبر میں پہلے سے ہی ایک اعشاریہ موجود ہے",
	"components.input-number.hintDecimalIncorrectComma": "اعشاریہ نمبر شامل کرنے کے لیے کوما ”،“ علامت کا استعمال کریں",
	"components.input-number.hintDecimalIncorrectPeriod": "اعشاری رقم شامل کرنے کے لیے فل اسٹاپ “۔” علامت کا استعمال کریں",
	"components.input-number.hintInteger": "یہ فیلڈ صرف انٹیجر ویلیوز کو قبول کرتی ہے (کوئی اعشاریہ نہیں)",
	"components.input-search.clear": "تلاش کو صاف کریں",
	"components.input-search.defaultPlaceholder": "تلاش کریں...",
	"components.input-search.search": "تلاش کریں",
	"components.input-time-range.endTime": "اختتام کا ٹائم",
	"components.input-time-range.errorBadInput": "{startLabel} کو {endLabel} سے پہلے ہونا چاہیے",
	"components.input-time-range.startTime": "آغاز کا ٹائم",
	"components.interactive.instructions": "تعامل کے لیے انٹر دبائیں، باہر نکلنے کے لیے ایسکیپ کریں",
	"components.link.open-in-new-window": "ایک نئی ونڈو میں کھولیں۔",
	"components.list.keyboard": "اس <b>فہرست کے</b>اندر فوکس کو منتقل کرنے کے لئے <b>تیر کی</b>چابیاں استعمال کریں، یا 5 سے اوپر یا نیچے منتقل کرنے کے لئے پیج اپ/ڈاؤن استعمال کریں",
	"components.list-controls.label": "فہرست کے لیے اعمال",
	"components.list-item.addItem": "آئٹم شامل کریں",
	"components.list-item-drag-handle.default": "{name} کے لیے آئٹم ایکشن کو دوبارہ ترتیب دیں",
	"components.list-item-drag-handle.keyboard": "آئٹم کو دوبارہ ترتیب دیں، موجودہ پوزیشن {size} میں سے {currentPosition} ہے۔ اس آئٹم کو منتقل کرنے کے لیے، اوپر یا نیچے والے تیروں کو دبائیں۔",
	"components.list-item-drag-handle.side-to-side.keyboard": "Reorder item, current position {currentPosition} out of {size}. To move this item, press left or right arrows.",
	"components.list-item-drag-handle-tooltip.enter-desc": "کی بورڈ کو دوبارہ ترتیب دینے کے موڈ کو ٹوگل کریں۔",
	"components.list-item-drag-handle-tooltip.enter-key": "داخل کریں",
	"components.list-item-drag-handle-tooltip.left-right-desc": "نیسٹنگ لیول تبدیل کریں۔",
	"components.list-item-drag-handle-tooltip.left-right-key": "بائیں/دائیں",
	"components.list-item-drag-handle-tooltip.side-to-side.left-right-desc": "Move item left or right in the list.",
	"components.list-item-drag-handle-tooltip.side-to-side.up-down-desc": "Move item left or right in the list.",
	"components.list-item-drag-handle-tooltip.title": "ری آرڈرنگ کے لیے کی بورڈ کنٹرولز:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "فہرست میں آئٹم کو اوپر یا نیچے منتقل کریں۔",
	"components.list-item-drag-handle-tooltip.up-down-key": "اوپر/نیچے",
	"components.menu-item-return.return": "پچھلے مینو پر واپس جائیں۔",
	"components.menu-item-return.returnCurrentlyShowing": "پچھلے مینو پر واپس جائیں۔ آپ {menuTitle} دیکھ رہے ہیں۔",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} میں سے {y}",
	"components.meter-mixin.progressIndicator": "ترقی کے اشارے",
	"components.more-less.less": "کم",
	"components.more-less.more": "مزید",
	"components.object-property-list.item-placeholder-text": "پلیس ہولڈر آئٹم",
	"components.overflow-group.moreActions": "مزید اعمال",
	"components.page.footer-region-label": "Footer",
	"components.page.header-nav-label": "مین",
	"components.page.side-nav-divider-label": "Side Navigation Divider",
	"components.page.side-nav-label": "سائیڈ",
	"components.page.side-nav-scrim": "Main content is currently hidden by the Side Navigation Panel. Close the panel to access.",
	"components.page.supporting-divider-label": "Supporting Panel Divider",
	"components.page.supporting-label": "Supporting",
	"components.page.supporting-scrim": "Main content is currently hidden by the Supporting Panel. Close the panel to access.",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} آئٹم}
			other {{countFormatted} آئٹمز}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{totalCountFormatted} آئٹم کا {countFormatted}}
			other {{totalCountFormatted} آئٹمز کا {countFormatted}}
		}`,
	"components.pager-load-more.action": "مزید لوڈ کریں",
	"components.pager-load-more.action-with-page-size": "{count} مزید لوڈ کریں",
	"components.pager-load-more.status-loading": "مزید آئٹمز لوڈ کی جارہی ہیں",
	"components.scroll-wrapper.scroll-left": "بائیں طرف سکرول کریں",
	"components.scroll-wrapper.scroll-right": "دائیں طرف سکرول کریں",
	"components.selection.action-max-hint":
		`{count, plural,
			one {جب {countFormatted} سے زائد آئٹم منتخب کیے جائیں تو غیر فعال}
			other {جب {countFormatted} سے زائد آئٹمز منتخب کیے جائیں تو غیر فعال}
		}`,
	"components.selection.action-required-hint": "اس کارروائی کو انجام دینے کے لیے کسی آئٹم کو منتخب کریں",
	"components.selection.select-all": "تمام منتخب کریں",
	"components.selection.select-all-items":
		`{count, plural,
			=1 {آئٹم منتخب کریں}
			one {تمام {countFormatted} آئٹم منتخب کریں}
			other {تمام {countFormatted} آئٹمز منتخب کریں}
		}`,
	"components.selection.selected": "{count} منتخب کیا گیا",
	"components.selection.selected-plus": "{count}+ منتخب کیا گیا",
	"components.selection-controls.label": "انتخاب کے لیے اقدامات",
	"components.skip-nav.skipToMainContent": "مرکزی کانٹینٹ پر جائیں",
	"components.sort.label": "سورٹ کریں",
	"components.sort.text": "سورٹ کریں: {selectedItemText}",
	"components.switch.conditions": "شرائط پوری ہونی چاہئیں",
	"components.switch.hidden": "پوشیدہ",
	"components.switch.visible": "مرئی",
	"components.switch.visibleWithPeriod": "دکھائی دیتی ہے۔",
	"components.table-col-sort-button.addSortOrder": "سورٹ کریں آرڈر شامل کرنے کے لیے منتخب کریں",
	"components.table-col-sort-button.changeSortOrder": "سورٹ کریں آرڈر تبدیل کرنے کے لیے منتخب کریں",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {پرانے میں نیا ترتیب دیا گیا}
				other {پرانے میں نئے سے ترتیب دیا گیا}
			}}
			numbers {{direction, select,
				desc {اعلی سے کم تک ترتیب دیا گیا}
				other {کم سے اونچا تک ترتیب دیا گیا}
			}}
			words {{direction, select,
				desc {Z سے A تک ترتیب دیا گیا}
				other {A سے Z تک ترتیب دیا گیا}
			}}
			value {ترتیب دیا گیا {selectedMenuItemText}}
			other {{direction, select,
				desc {ترتیب دیا گیا نزولِ ترتیب}
				other {ترتیب دی گئی چڑھائی}
			}}
		}`,
	"components.table-controls.label": "میز کے لئے اعمال",
	"components.tabs.next": "آگے اسکرال کریں",
	"components.tabs.previous": "پیچھے کی طرف اسکرال کریں",
	"components.tag-list.clear": "آئٹم {value} کو ہٹانے کے لیے کلک کریں، بیک اسپیس دبائیں، یا ڈیلیٹ کی دبائیں۔",
	"components.tag-list.clear-all": "سب کو صاف کریں",
	"components.tag-list.cleared-all": "ٹیگ لسٹ کی تمام اشیاء کو ہٹا دیا گیا",
	"components.tag-list.cleared-item": "ٹیگ لسٹ آئٹم {value} کو ہٹا دیا گیا",
	"components.tag-list.interactive-label": "ٹیگ کی فہرست، {count} آئٹمز",
	"components.tag-list.num-hidden": "{count} + مزید",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {0 آئٹمز کے ساتھ ٹیگ لسٹ}
			one {{count} آئٹم کے ساتھ ٹیگ لسٹ}
			other {{count} آئٹمز کے ساتھ ٹیگ لسٹ}
		}`,
	"components.tag-list.show-less": "کم شو کریں",
	"components.tag-list.show-more-description": "پوشیدہ ٹیگ لسٹ آئٹمز کو شو کرنے کے لیے منتخب کریں",
	"components.tag-list-item.role-description": "ٹیگ",
	"components.tag-list-item.tooltip-arrow-keys": "ایرو کیز",
	"components.tag-list-item.tooltip-arrow-keys-desc": "ٹیگز کے درمیان حرکت کریں",
	"components.tag-list-item.tooltip-delete-key": "بیک اسپیس/ڈیلیٹ کریں",
	"components.tag-list-item.tooltip-delete-key-desc": "مرکوز شدہ ٹیگ کو حذف کریں",
	"components.tag-list-item.tooltip-title": "کی بورڈ کنٹرول",
	"components.view-switcher.role-description":
		`{count, plural,
			=0 {0 آئٹمز کے ساتھ ویو سوئچر}
			one {{count} آئٹم کے ساتھ ویو سوئچر}
			other {{count} آئٹمز کے ساتھ ویو سوئچر}
		}`,
	"templates.primary-secondary.divider": "ثانوی پینل ڈیوائیڈر",
	"templates.primary-secondary.secondary-panel": "ثانوی پینل"
};
