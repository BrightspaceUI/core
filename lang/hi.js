export default {
	"components.alert.close": "अलर्ट बंद करें",
	"components.breadcrumbs.breadcrumb": "ब्रेडक्रंब",
	"components.button-add.addItem": "आइटम जोड़ें",
	"components.button-split.otherOptions": "अन्य विकल्प",
	"components.calendar.hasEvents": "ईवेंट हैं।",
	"components.calendar.notSelected": "चयनित नहीं।",
	"components.calendar.selected": "चयनित।",
	"components.calendar.show": "{month} दिखाएँ",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "यह संवाद बंद करें",
	"components.dialog.critical": "महत्वपूर्ण!",
	"components.dropdown.close": "बंद करें",
	"components.filter.activeFilters": "सक्रिय फ़िल्टर्स:",
	"components.filter.additionalContentTooltip": "इस सूची आइटम के अंदर फ़ोकस ले जाने के लिए <b>बाएं/दाएं तीर कुंजियों</b> का उपयोग करें",
	"components.filter.clear": "साफ़ करें",
	"components.filter.clearAll": "सभी साफ़ करें",
	"components.filter.clearAllAnnounce": "सभी फिल्टर साफ़ किए जा रहे हैं",
	"components.filter.clearAllAnnounceOverride": "{filterText}: के लिए सभी फ़िल्टर्स साफ़ कर रहा है",
	"components.filter.clearAllDescription": "सभी फिल्टर साफ़ करें",
	"components.filter.clearAllDescriptionOverride": "{filterText}: के लिए सभी फ़िल्टर्स साफ़ करें",
	"components.filter.clearAnnounce": "इसके लिए फ़िल्टर साफ़ हो रहे हैं: {filterName}",
	"components.filter.clearDescription": "इसके लिए फ़िल्टर्स साफ़ करें: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {कोई फ़िल्टर लागू नहीं किए गए}
			one {1 फ़िल्टर लागू किया गया।}
			other {{number} फ़िल्टर्स लागू किए गए।}
		}`,
	"components.filter.filters": "फ़िल्टर्स",
	"components.filter.loading": "फिल्टर्स लोड किए जा रहे हैं",
	"components.filter.noFilters": "कोई उपलब्ध फ़िल्टर्स नहीं",
	"components.filter.searchResults":
		`{number, plural,
			=0 {कोई खोज परिणाम नहीं}
			one {{number} खोज परिणाम}
			other {{number} खोज परिणाम}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. चुने गए फ़िल्टर सबसे पहले दिखाई देते हैं।",
	"components.filter.singleDimensionDescription": "इसके अनुसार फ़िल्टर करें: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {आज}
			one {अंतिम {num} दिन}
			other {अंतिम {num} दिनों}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {अंतिम घंटा}
			other {अंतिम {num} घंटे}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "अंतिम {num} महीने",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, तारीख चुनने के लिए विस्तृत करें",
	"components.filter-dimension-set-date-time-range-value.text": "कस्टम तारीख सीमा",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} से {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "{endValue} के पहले",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "{startValue} के बाद",
	"components.form-element.defaultError": "{label} अमान्य है",
	"components.form-element.defaultFieldLabel": "फ़ील्ड",
	"components.form-element.input.email.typeMismatch": "ईमेल मान्य नहीं है",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {संख्या {min} से ज़्यादा और {max} से कम होनी चाहिए.}
				other {संख्या {min} से ज़्यादा और {max} से कम या उसके बराबर होनी चाहिए.}
			}}
			other {{maxExclusive, select,
				true {संख्या {min} से ज़्यादा या उसके बराबर और {max} से कम होनी चाहिए.}
				other {संख्या  {min} से ज़्यादा या उसके बराबर और {max} से कम या उसके बराबर होनी चाहिए.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {संख्या {max} से कम होनी चाहिए.}
			other {संख्या {max} से कम या उसके बराबर होनी चाहिए.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {संख्या {min} से ज़्यादा होनी चाहिए.}
			other {संख्या {min} से ज़्यादा या उसके बराबर होनी चाहिए.}
		}`,
	"components.form-element.input.text.tooShort": "{label} कम से कम {minlength} वर्णों का होना चाहिए",
	"components.form-element.input.url.typeMismatch": "URL मान्य नहीं है",
	"components.form-element.valueMissing": "{label} ज़रूरी है",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {आपके द्वारा सबमिट की गई जानकारी में {count} त्रुटियाँ पाई गईं}
			other {आपके द्वारा सबमिट की गई जानकारी में {count} त्रुटियाँ पाई गईं}
		}`,
	"components.form-error-summary.text": "त्रुटि विवरण टॉगल करें",
	"components.input-color.backgroundColor": "पृष्ठभूमि का रंग",
	"components.input-color.foregroundColor": "अग्रभूमि का रंग",
	"components.input-color.none": "कोई नहीं",
	"components.input-date.clear": "साफ़ करें",
	"components.input-date.errorMaxDateOnly": "तारीख, {maxDate} या उससे पहले की होनी चाहिए",
	"components.input-date.errorMinDateOnly": "तारीख, {minDate} या उससे बाद की होनी चाहिए",
	"components.input-date.errorOutsideRange": "तारीख़ {minDate} और {maxDate} के बीच होनी चाहिए",
	"components.input-date.now": "अभी",
	"components.input-date.openInstructions": "तारीख़ फ़ॉर्मेट {format} का उपयोग करें। लघु-कैलेंडर तक पहुँचने के लिए तीर नीचे या एंटर दबाएँ।",
	"components.input-date.revert": "{label} को पिछले मान पर रिवर्ट किया गया।",
	"components.input-date.today": "आज",
	"components.input-date.useDateFormat": "तारीख फ़ॉर्मेट {format} का उपयोग करें।",
	"components.input-date-range.endDate": "समाप्ति तारीख़",
	"components.input-date-range.errorBadInput": "{startLabel} {endLabel} से पहले का होना चाहिए",
	"components.input-date-range.interactive-label": "तारीख सीमा इनपुट",
	"components.input-date-range.startDate": "प्रारंभ तारीख़",
	"components.input-date-time.date": "तारीख़",
	"components.input-date-time.errorMaxDateOnly": "तारीख, {maxDate} या उससे पहले की होनी चाहिए",
	"components.input-date-time.errorMinDateOnly": "तारीख, {minDate} या उससे बाद की होनी चाहिए",
	"components.input-date-time.errorOutsideRange": "तारीख़ {minDate} और {maxDate} के बीच होनी चाहिए",
	"components.input-date-time.time": "समय",
	"components.input-date-time-range.endDate": "समाप्ति तारीख़",
	"components.input-date-time-range.errorBadInput": "{startLabel} {endLabel} से पहले का होना चाहिए",
	"components.input-date-time-range.interactive-label": "तारीख और समय सीमा इनपुट",
	"components.input-date-time-range.startDate": "प्रारंभ तारीख़",
	"components.input-date-time-range-to.to": "प्रति",
	"components.input-number.hintDecimalDuplicate": "इस संख्या में पहले से ही कोई दशमलव है",
	"components.input-number.hintDecimalIncorrectComma": "दशमलव जोड़ने के लिए, अल्पविराम “,” वर्ण का उपयोग करें",
	"components.input-number.hintDecimalIncorrectPeriod": "दशमलव जोड़ने के लिए, पीरियड “.” वर्ण का उपयोग करें",
	"components.input-number.hintInteger": "यह फ़ील्ड केवल पूर्णांक मानों (कोई दशमलव नहीं) को स्वीकार करती है",
	"components.input-search.clear": "खोज साफ़ करें",
	"components.input-search.defaultPlaceholder": "खोजें...",
	"components.input-search.search": "खोजें",
	"components.input-time-range.endTime": "समाप्ति समय",
	"components.input-time-range.errorBadInput": "{startLabel} {endLabel} से पहले का होना चाहिए",
	"components.input-time-range.startTime": "प्रारंभ समय",
	"components.interactive.instructions": "बातचीत करने के लिए Enter दबाएँ, बाहर निकलने के लिए Escape दबाएँ",
	"components.link.open-in-new-window": "एक नई विंडो में खुलता है।",
	"components.list.keyboard": "फ़ोकस को इस लिस्ट में ले जाने के लिए <b>तीर वाली बटनों</b> अथवा 5 के ज़रिए ऊपर या नीचे जाने के लिए <b>पेज ऊपर/नीचे</b> बटनों का उपयोग करें",
	"components.list-controls.label": "सूची के लिए क्रियाएँ",
	"components.list-item.addItem": "आइटम जोड़ें",
	"components.list-item-drag-handle.default": "{name} के लिए आइटम कार्रवाई का क्रम बदलें",
	"components.list-item-drag-handle.keyboard": "आइटम का क्रम बदलें, {size} में से वर्तमान स्थिति {currentPosition} इस आइटम को ले जाने के लिए, ऊपर या नीचे तीर दबाएँ।",
	"components.list-item-drag-handle-tooltip.enter-desc": "कीबोर्ड का क्रम बदलना मोड को टॉगल करें।",
	"components.list-item-drag-handle-tooltip.enter-key": "डालें",
	"components.list-item-drag-handle-tooltip.left-right-desc": "नेस्ट करने का स्तर बदलें।",
	"components.list-item-drag-handle-tooltip.left-right-key": "बायाँ/दायाँ",
	"components.list-item-drag-handle-tooltip.title": "क्रम बदलने के लिए कीबोर्ड नियंत्रण:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "आइटम को सूची में ऊपर या नीचे ले जाएँ।",
	"components.list-item-drag-handle-tooltip.up-down-key": "ऊपर/नीचे",
	"components.menu-item-return.return": "पिछले मेनू पर वापस जाएँ।",
	"components.menu-item-return.returnCurrentlyShowing": "पिछले मेनू पर वापस जाएँ। आप {menuTitle} देख रहे हैं।",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{y} में से {x}",
	"components.meter-mixin.progressIndicator": "प्रगति संकेतक",
	"components.more-less.less": "कम",
	"components.more-less.more": "अधिक",
	"components.object-property-list.item-placeholder-text": "प्लेसहोल्डर आइटम",
	"components.overflow-group.moreActions": "अधिक क्रियाएँ",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} आइटम}
			other {{countFormatted} आइटम}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{totalCountFormatted} में से {countFormatted} आइटम}
			other {{totalCountFormatted} में से {countFormatted} आइटम}
		}`,
	"components.pager-load-more.action": "और लोड करें",
	"components.pager-load-more.action-with-page-size": "{count} और लोड करें",
	"components.pager-load-more.status-loading": "और आइटम लोड करना",
	"components.selection.action-max-hint":
		`{count, plural,
			one {{countFormatted} से अधिक आइटम चुने जाने पर अक्षम किया गया जाता है}
			other {{countFormatted} अधिक आइटम्स चुने जाने पर अक्षम किया गया जाता है}
		}`,
	"components.selection.action-required-hint": "यह कार्रवाई करने के लिए किसी आइटम का चयन करें",
	"components.selection.select-all": "सभी का चयन करें",
	"components.selection.select-all-items": "सभी {count} आइटम चुनें।",
	"components.selection.selected": "{count} चयनित",
	"components.selection.selected-plus": "{count} से अधिक चयनित",
	"components.selection-controls.label": "चयन के लिए क्रियाएँ",
	"components.sort.label": "सॉर्ट करें",
	"components.sort.text": "सॉर्ट करें: {selectedItemText}",
	"components.switch.conditions": "शर्तें पूरी होनी चाहिए",
	"components.switch.hidden": "छुपा हुआ",
	"components.switch.visible": "दृश्यमान",
	"components.switch.visibleWithPeriod": "दृश्यमान।",
	"components.table-col-sort-button.addSortOrder": "क्रमबद्ध अनुक्रम जोड़ने के लिए चुनें",
	"components.table-col-sort-button.changeSortOrder": "क्रमबद्ध अनुक्रम बदलने के लिए चुनें",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {नए से पुराने तक क्रमबद्ध}
				other {पुराने से नये तक क्रमबद्ध}
			}}
			numbers {{direction, select,
				desc {उच्च से निम्न क्रमबद्ध}
				other {निम्न से उच्च क्रमबद्ध}
			}}
			words {{direction, select,
				desc {Z से A तक क्रमबद्ध}
				other {A से Z तक क्रमबद्ध}
			}}
			value {क्रमबद्ध किया गया {selectedMenuItemText}}
			other {{direction, select,
				desc {अवरोही क्रम में क्रमबद्ध}
				other {आरोही क्रम में क्रमबद्ध}
			}}
		}`,
	"components.table-controls.label": "तालिका के लिए क्रियाएँ",
	"components.tabs.next": "आगे स्क्रॉल करें",
	"components.tabs.previous": "पीछे स्क्रॉल करें",
	"components.tag-list.clear": "{value} को हटाने के लिए क्लिक करें, बैकस्पेस दबाएँ, या हटाएँ कुंजी को दबाएँ",
	"components.tag-list.clear-all": "सभी साफ़ करें",
	"components.tag-list.cleared-all": "सभी टैग लिस्ट आइटम हटाए गए",
	"components.tag-list.cleared-item": "टैग लिस्ट आइटम {value} हटाए गए",
	"components.tag-list.interactive-label": "टैग लिस्ट, {count} आइटम",
	"components.tag-list.num-hidden": "+ {count} और",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {0 आइटम के साथ सूची टैग करें}
			one {{count} आइटम के साथ सूची टैग करें}
			other {{count} आइटम के साथ सूची टैग करें}
		}`,
	"components.tag-list.show-less": "कम दिखाएँ",
	"components.tag-list.show-more-description": "छिपे हुए टैग लिस्ट आइटम दिखाने के लिए चुनें",
	"components.tag-list-item.role-description": "टैग",
	"components.tag-list-item.tooltip-arrow-keys": "तीर कुंजियाँ",
	"components.tag-list-item.tooltip-arrow-keys-desc": "टैग के बीच आना-जाना",
	"components.tag-list-item.tooltip-delete-key": "बैकस्पेस/हटाएँ",
	"components.tag-list-item.tooltip-delete-key-desc": "फ़ोकिस किए हुए टैग को हटाएँ",
	"components.tag-list-item.tooltip-title": "कीबोर्ड कंट्रोल",
	"templates.primary-secondary.divider": "सेकेंडरी पैनल डिवाइडर",
	"templates.primary-secondary.secondary-panel": "सेकेंडरी पैनल"
};
