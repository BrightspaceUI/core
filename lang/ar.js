export default {
	"components.alert.close": "إغلاق التنبيه",
	"components.breadcrumbs.breadcrumb": "شريط التنقل",
	"components.button-add.addItem": "إضافة عنصر",
	"components.calendar.notSelected": "لم يتم التحديد.",
	"components.calendar.selected": "تم التحديد.",
	"components.calendar.show": "إظهار {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "إغلاق مربع الحوار هذا",
	"components.dialog.critical": "مهم!",
	"components.dropdown.close": "إغلاق",
	"components.filter.activeFilters": "عوامل تصفية نشطة:",
	"components.filter.additionalContentTooltip": "استخدم <b>مفاتيح السهم لليمين/اليسار</b> لنقل التركيز داخل عنصر القائمة هذا",
	"components.filter.clear": "مسح",
	"components.filter.clearAll": "مسح الكل",
	"components.filter.clearAllAnnounce": "جارٍ مسح كل عوامل التصفية",
	"components.filter.clearAllAnnounceOverride": "جارٍ مسح كل عوامل التصفية لـ: {filterText}",
	"components.filter.clearAllDescription": "مسح كل عوامل التصفية",
	"components.filter.clearAllDescriptionOverride": "مسح كل عوامل التصفية لـ: {filterText}",
	"components.filter.clearAnnounce": "جارٍ مسح عوامل التصفية لـ: {filterName}",
	"components.filter.clearDescription": "مسح عوامل التصفية لـ: {filterName}",
	"components.filter.loading": "يتم تحميل عوامل التصفية",
	"components.filter.filterCountDescription":
	`{number, plural,
		=0 {لم يتم تطبيق عوامل تصفية.}
		zero {تم تطبيق {number} من عوامل التصفية.}
		one {تم تطبيق {number} عامل تصفية}
		two {تم تطبيق {number} من عوامل التصفية.}
		few {تم تطبيق {number} من عوامل التصفية.}
		many {تم تطبيق {number} من عوامل التصفية.}
		other {تم تطبيق {number} من عوامل التصفية.}
	}`,
	"components.filter.filters": "عوامل التصفية",
	"components.filter.noFilters": "ما من عوامل تصفية متوفرة",
	"components.filter.searchResults":
	`{number, plural,
		=0 {ما من نتائج بحث}
		zero {{number} من نتائج البحث}
		one {{number} نتيجة بحث}
		two {{number} من نتائج البحث}
		few {{number} من نتائج البحث}
		many {{number} من نتائج البحث}
		other {{number} من نتائج البحث}
	}`,
	"components.filter.selectedFirstListLabel": "{headerText}. تظهر عوامل التصفية المحددة أولاً.",
	"components.filter.singleDimensionDescription": "التصفية حسب: {filterName}",
	"components.filter-dimension-set-date-text-value.textHours":
	`{num, plural,
		=1 {آخر ساعة}
		zero {آخر {num} من الساعات}
		two {آخر {num} من الساعات}
		few {آخر {num} من الساعات}
		many {آخر {num} من الساعات}
		other {آخر {num} من الساعات}
	}`,
	"components.filter-dimension-set-date-text-value.textDays":
	`{num, plural,
		=0 {يوم}
		zero {آخر {num} من الأيام}
		one {آخر {num} يوم}
		two {آخر {num} من الأيام}
		few {آخر {num} من الأيام}
		many {آخر {num} من الأيام}
		other {آخر {num} من الأيام}
	}`,
	"components.filter-dimension-set-date-text-value.textMonths": "آخر {num} من الأشهر",
	"components.filter-dimension-set-date-time-range-value.label": "{text}، التوسيع لاختيار التواريخ",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} إلى {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "تاريخ البدء: {startValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "تاريخ النهاية: {endValue}",
	"components.filter-dimension-set-date-time-range-value.text": "نطاق التاريخ المخصص",
	"components.form-element.defaultError": "{label} غير صالحة.",
	"components.form-element.defaultFieldLabel": "الحقل",
	"components.form-element.input.email.typeMismatch": "البريد الإلكتروني غير صالح",
	"components.form-element.input.number.rangeError":
	`{minExclusive, select,
		true {{maxExclusive, select,
			true {يجب أن يكون الرقم أكبر من {min} وأقل من {max}.}
			other {يجب أن يكون الرقم أكبر من {min} وأقل من أو مساويًا لـ {max}.}
		}}
		other {{maxExclusive, select,
			true {يجب أن يكون الرقم أكبر من أو مساويًا لـ {min} وأقل من {max}.}
			other {يجب أن يكون الرقم أكبر من أو مساويًا لـ {min} وأقل من أو مساويًا لـ {max}.}
		}}
	}`,
	"components.form-element.input.number.rangeOverflow":
	`{maxExclusive, select,
		true {يجب أن يكون الرقم أقل من {max}.}
		other {يجب أن يكون الرقم أقل من أو مساويًا لـ {max}.}
	}`,
	"components.form-element.input.number.rangeUnderflow":
	`{minExclusive, select,
		true {يجب أن يكون الرقم أكبر من {min}.}
		other {يجب أن يكون الرقم أكبر من أو مساويًا لـ {min}.}
	}`,
	"components.form-element.input.text.tooShort": "يجب أن تتألف التسمية {label} من {minlength} من الأحرف على الأقل",
	"components.form-element.input.url.typeMismatch": "عنوان URL غير صالح",
	"components.form-element.valueMissing": "{label} مطلوبة.",
	"components.form-error-summary.errorSummary":
	`{count, plural,
		zero {تم العثور على {count} من الأخطاء في المعلومات التي أرسلتها}
		one {تم العثور على {count} خطأ في المعلومات التي أرسلتها}
		two {تم العثور على {count} من الأخطاء في المعلومات التي أرسلتها}
		few {تم العثور على {count} من الأخطاء في المعلومات التي أرسلتها}
		many {تم العثور على {count} من الأخطاء في المعلومات التي أرسلتها}
		other {تم العثور على {count} من الأخطاء في المعلومات التي أرسلتها}
	}`,
	"components.input-color.backgroundColor": "لون الخلفية",
	"components.input-color.foregroundColor": "لون المقدمة",
	"components.input-color.none": "لا شيء",
	"components.input-date-range.endDate": "تاريخ الانتهاء",
	"components.input-date-range.errorBadInput": "يجب أن يكون تاريخ {startLabel} قبل {endLabel}",
	"components.input-date-range.interactive-label": "إدخال نطاق التاريخ",
	"components.input-date-range.startDate": "تاريخ البدء",
	"components.input-date-time-range-to.to": "إلى",
	"components.input-date-time-range.endDate": "تاريخ الانتهاء",
	"components.input-date-time-range.errorBadInput": "يجب أن يكون تاريخ {startLabel} قبل {endLabel}",
	"components.input-date-time-range.startDate": "تاريخ البدء",
	"components.input-date-time.date": "التاريخ",
	"components.input-date-time.errorMaxDateOnly": "يجب أن يكون التاريخ في {maxDate} أو قبله",
	"components.input-date-time.errorMinDateOnly": "يجب أن يكون التاريخ في {minDate} أو بعده",
	"components.input-date-time.errorOutsideRange": "يجب أن يكون التاريخ بين {minDate} و{maxDate}",
	"components.input-date-time.time": "الوقت",
	"components.input-date-time-range.interactive-label": "إدخال نطاق التاريخ والوقت",
	"components.input-date.clear": "مسح",
	"components.input-date.errorMaxDateOnly": "يجب أن يكون التاريخ في {maxDate} أو قبله",
	"components.input-date.errorMinDateOnly": "يجب أن يكون التاريخ في {minDate} أو بعده",
	"components.input-date.errorOutsideRange": "يجب أن يكون التاريخ بين {minDate} و{maxDate}",
	"components.input-date.openInstructions": "استخدم تنسيق التاريخ {format}. انتقل إلى الأسفل أو اضغط على Enter للوصول إلى التقويم المصغّر.",
	"components.input-date.now": "الآن",
	"components.input-date.today": "اليوم",
	"components.input-number.hintInteger": "يقبل هذا الحقل قيم الأعداد الصحيحة فقط (بدون أعداد عشرية)",
	"components.input-number.hintDecimalDuplicate": "يوجد عدد عشري في هذا الرقم",
	"components.input-number.hintDecimalIncorrectComma": "لإضافة عدد عشري، استخدم حرف الفاصلة ”,“",
	"components.input-number.hintDecimalIncorrectPeriod": "لإضافة عدد عشري، استخدم حرف النقطة ”.“",
	"components.input-search.clear": "مسح البحث",
	"components.input-search.defaultPlaceholder": "البحث...",
	"components.input-search.search": "بحث",
	"components.input-time-range.endTime": "وقت النهاية",
	"components.input-time-range.errorBadInput": "يجب أن يكون تاريخ {startLabel} قبل {endLabel}",
	"components.input-time-range.startTime": "وقت البدء",
	"components.interactive.instructions": "اضغط على Enter للتفاعل، وEscape للخروج",
	"components.link.open-in-new-window": "يفتح في نافذة جديدة.",
	"components.list.keyboard": "استخدم <b>مفاتيح الأسهم</b> لنقل التركيز داخل هذه القائمة، أو <b>صفحة إلى الأعلى/الأسفل</b> للتحرك إلى الأعلى أو الأسفل بمقدار 5",
	"components.list-controls.label": "إجراءات القائمة",
	"components.list-item.addItem": "إضافة عنصر",
	"components.list-item-drag-handle.default": "إعادة ترتيب إجراء المادة لـ {name}",
	"components.list-item-drag-handle.keyboard": "إعادة ترتيب المواد، الموضع الحالي {currentPosition} من أصل {size}. لنقل هذه المادة، اضغط على السهم المتجه إلى أعلى أو السهم المتجه إلى أسفل.",
	"components.list-item-drag-handle-tooltip.title": "عناصر التحكم بلوحة المفاتيح لإعادة الترتيب:",
	"components.list-item-drag-handle-tooltip.enter-key": "إدخال",
	"components.list-item-drag-handle-tooltip.enter-desc": "تبديل وضع إعادة ترتيب لوحة المفاتيح.",
	"components.list-item-drag-handle-tooltip.up-down-key": "أعلى/أسفل",
	"components.list-item-drag-handle-tooltip.up-down-desc": "نقل المادة إلى الأعلى أو الأسفل في القائمة.",
	"components.list-item-drag-handle-tooltip.left-right-key": "يسار/يمين",
	"components.list-item-drag-handle-tooltip.left-right-desc": "غيِّر مستوى التداخل.",
	"components.menu-item-return.return": "العودة إلى القائمة السابقة.",
	"components.menu-item-return.returnCurrentlyShowing": "العودة إلى القائمة السابقة. يتم عرض {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}، ‏{term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} من {y}",
	"components.meter-mixin.progressIndicator": "مؤشر التقدم",
	"components.more-less.less": "أقل",
	"components.more-less.more": "المزيد",
	"components.object-property-list.item-placeholder-text": "عنصر نائب",
	"components.overflow-group.moreActions": "مزيد من الإجراءات",
	"components.pager-load-more.action": "تحميل المزيد",
	"components.pager-load-more.action-with-page-size": "تحميل {count} إضافي",
	"components.pageable.info":
	`{count, plural,
		zero {{countFormatted} من المواد}
		one {{countFormatted} مادة واحد}
		two {{countFormatted} من المواد}
		few {{countFormatted} من المواد}
		many {{countFormatted} من المواد}
		other {{countFormatted} من المواد}
	}`,
	"components.pageable.info-with-total":
	`{totalCount, plural,
		zero {{countFormatted} من أصل {totalCountFormatted} من المواد}
		one {{countFormatted} من أصل {totalCountFormatted} مادة واحدة}
		two {{countFormatted} من أصل {totalCountFormatted} من المواد}
		few {{countFormatted} من أصل {totalCountFormatted} من المواد}
		many {{countFormatted} من أصل {totalCountFormatted} من المواد}
		other {{countFormatted} من أصل {totalCountFormatted} من المواد}
	}`,
	"components.pager-load-more.status-loading": "تحميل المزيد من المواد",
	"components.selection.action-hint": "حدد مادة لتنفيذ هذا الإجراء.",
	"components.selection.select-all": "تحديد الكل",
	"components.selection.select-all-items": "تحديد كل المواد الـ {count}.",
	"components.selection.selected": "تم تحديد {count}",
	"components.selection.selected-plus": "تم تحديد {count}+‎",
	"components.selection-controls.label": "إجراءات التحديد",
	"components.switch.visible": "مرئي",
	"components.switch.visibleWithPeriod": "مرئي.",
	"components.switch.hidden": "مخفي",
	"components.switch.conditions": "يجب استيفاء الشروط",
	"components.table-col-sort-button.addSortOrder": "التحديد لإضافة ترتيب الفرز",
	"components.table-col-sort-button.changeSortOrder": "التحديد لتغيير ترتيب الفرز",
	"components.table-col-sort-button.title":
	`{sourceType, select,
		dates {{direction, select,
			desc {الفرز من الجديد إلى القديم}
			other {الفرز من القديم إلى الجديد}
		}}
		numbers {{direction, select,
			desc {الفرز من الأعلى إلى الأدنى}
			other {الفرز من الأدنى إلى الأعلى}
		}}
		words {{direction, select,
			desc {الفرز من ي إلى أ}
			other {الفرز من أ إلى ي}
		}}
		value {الفرز {selectedMenuItemText}}
		other {{direction, select,
			desc {الفرز تنازليًا}
			other {الفرز تصاعديًا}
		}}
	}`,
	"components.table-controls.label": "إجراءات للجدول",
	"components.tabs.next": "التمرير إلى الأمام",
	"components.tabs.previous": "التمرير إلى الخلف",
	"components.tag-list.clear": "انقر فوق، أو اضغط على مسافة للخلف، أو اضغط على مفتاح حذف لإزالة العنصر {value}",
	"components.tag-list.clear-all": "مسح الكل",
	"components.tag-list.cleared-all": "تمت إزالة كل عناصر قائمة العلامات",
	"components.tag-list.cleared-item": "تمت إزالة عنصر قائمة العلامات {value}",
	"components.tag-list.interactive-label": "قائمة العلامات، {count} من العناصر",
	"components.tag-list.num-hidden": "زيادة {count} إضافي",
	"components.tag-list.role-description": "قائمة العلامات",
	"components.tag-list.show-less": "إظهار أقل",
	"components.tag-list.show-more-description": "حدد لإظهار عناصر قائمة العلامات المخفية",
	"components.tag-list-item.role-description": "العلامة",
	"components.tag-list-item.tooltip-arrow-keys": "مفاتيح الأسهم",
	"components.tag-list-item.tooltip-arrow-keys-desc": "التنقل بين العلامات",
	"components.tag-list-item.tooltip-delete-key": "مسافة للخلف/حذف",
	"components.tag-list-item.tooltip-delete-key-desc": "حذف العلامة المركّز عليها",
	"components.tag-list-item.tooltip-title": "عناصر التحكم في لوحة المفاتيح",
	"templates.primary-secondary.divider": "فاصل اللوحة الثانوية",
	"templates.primary-secondary.secondary-panel": "اللوحة الثانوية"
};
