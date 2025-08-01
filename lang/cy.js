export default {
	"components.alert.close": "Cau Hysbysiad",
	"components.breadcrumbs.breadcrumb": "Briwsionyn Bara",
	"components.button-add.addItem": "Ychwanegu Eitem",
	"components.button-split.otherOptions": "Opsiynau Eraill",
	"components.calendar.hasEvents": "Yn Cynnwys Digwyddiadau.",
	"components.calendar.notSelected": "Heb ei Ddewis.",
	"components.calendar.selected": "Wedi’i Ddewis.",
	"components.calendar.show": "Dangos {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Cau’r dialog hwn",
	"components.dialog.critical": "Critigol!",
	"components.dropdown.close": "Cau",
	"components.filter.activeFilters": "Dim Hidlwyr Gweithredol:",
	"components.filter.additionalContentTooltip": "Defnyddiwch y <b>bysellau saeth chwith/dde</b> i symud ffocws y tu mewn yr eitem rhestr hon",
	"components.filter.clear": "Clirio",
	"components.filter.clearAll": "Clirio’r Cyfan",
	"components.filter.clearAllAnnounce": "Wrthi’n clirio’r holl hidlwyr",
	"components.filter.clearAllAnnounceOverride": "Wrthi’n clirio pob hidlydd ar gyfer: {filterText}",
	"components.filter.clearAllDescription": "Clirio’r holl hidlwyr",
	"components.filter.clearAllDescriptionOverride": "Clirio pob hidlydd ar gyfer: {filterText}",
	"components.filter.clearAnnounce": "Wrthi’n clirio hidlwyr ar gyfer: {filterName}",
	"components.filter.clearDescription": "Wrthi’n clirio hidlwyd ar gyfer: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Dim hidlyddion wedi’i gweithredu.}
			one {{number} hidlydd wedi’i weithredu.}
			other {{number} hidlyddion wedi’u gweithredu.}
		}`,
	"components.filter.filters": "Hidlyddion",
	"components.filter.loading": "Wrthi’n llwytho hidlyddion",
	"components.filter.noFilters": "Dim hidlyddion ar gael",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Dim canlyniadau chwilio}
			one {{number} canlyniad chwilio}
			other {{number} canlyniadau chwilio}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Mae’r hidlyddion a ddewiswyd yn ymddangos gyntaf.",
	"components.filter.singleDimensionDescription": "Hidlo yn ôl: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Heddiw}
			one {{num} diwrnod diwethaf}
			other {{num} o ddiwrnodau diwethaf}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Awr ddiwethaf}
			other {{num} awr ddiwethaf}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "{num} o fisoedd diwethaf",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, ehangwch i ddewis dyddiadau",
	"components.filter-dimension-set-date-time-range-value.text": "Ystod dyddiad pwrpasol",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} i {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Cyn {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Ar ôl {startValue}",
	"components.form-element.defaultError": "Mae {label} yn annilys",
	"components.form-element.defaultFieldLabel": "Maes",
	"components.form-element.input.email.typeMismatch": "Nid yw’r e-bost yn ddilys",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Rhaid i’r nifer fod yn fwy na {min} a llai na {max}.}
				other {Rhaid i’r nifer fod yn fwy na {min} a llai na neu’n hafal i {max}.}
			}}
			other {{maxExclusive, select,
				true {Rhaid i’r nifer fod yn fwy na neu’n hafal i {min} a llai na {max}.}
				other {Rhaid i’r nifer fod yn fwy na neu’n hafal i {min} a llai na neu’n hafal i {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Rhaid i’r nifer fod yn llai na {max}.}
			other {Rhaid i’r nifer fod yn llai na neu’n hafal i {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Rhaid i’r nifer fod yn fwy na {min}.}
			other {Rhaid i’r nifer fod yn fwy na neu’n hafal i {min}.}
		}`,
	"components.form-element.input.text.tooShort": "Rhaid i {label} fod o leiaf {minlength} nod",
	"components.form-element.input.url.typeMismatch": "Nid yw’r URL yn ddilys.",
	"components.form-element.valueMissing": "Mae angen {label}",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Canfuwyd {count} gwall yn y wybodaeth a gyflwynoch}
			other {Canfuwyd {count} gwall yn y wybodaeth a gyflwynoch}
		}`,
	"components.form-error-summary.text": "Toglo manylion gwall",
	"components.input-color.backgroundColor": "Lliw Cefndir",
	"components.input-color.foregroundColor": "Lliw Blaendir",
	"components.input-color.none": "Dim",
	"components.input-date.clear": "Clirio",
	"components.input-date.errorMaxDateOnly": "Rhaid i’r dyddiad fod cyn neu ar {maxDate}",
	"components.input-date.errorMinDateOnly": "Rhaid i’r dyddiad fod ar neu ar ôl {minDate}",
	"components.input-date.errorOutsideRange": "Rhaid i’r dyddiad fod rhwng {minDate} a {maxDate}",
	"components.input-date.now": "Nawr",
	"components.input-date.openInstructions": "Defnyddio fformat dyddiad {format}. Pwyswch saeth i lawr neu Enter i gael mynediad at galendr bach.",
	"components.input-date.revert": "Mae {label} wedi’i ddychwelyd i’r gwerth blaenorol.",
	"components.input-date.today": "Heddiw",
	"components.input-date.useDateFormat": "Defnyddio fformat dyddiad {format}.",
	"components.input-date-range.endDate": "Dyddiad Dod i Ben",
	"components.input-date-range.errorBadInput": "Rhaid i {startLabel} fod cyn {endLabel}",
	"components.input-date-range.interactive-label": "Mewnbwn ystod dyddiad",
	"components.input-date-range.startDate": "Dyddiad Dechrau",
	"components.input-date-time.date": "Dyddiad",
	"components.input-date-time.errorMaxDateOnly": "Rhaid i’r dyddiad fod cyn neu ar {maxDate}",
	"components.input-date-time.errorMinDateOnly": "Rhaid i’r dyddiad fod ar neu ar ôl {minDate}",
	"components.input-date-time.errorOutsideRange": "Rhaid i’r dyddiad fod rhwng {minDate} a {maxDate}",
	"components.input-date-time.time": "Amser",
	"components.input-date-time-range.endDate": "Dyddiad Dod i Ben",
	"components.input-date-time-range.errorBadInput": "Rhaid i {startLabel} fod cyn {endLabel}",
	"components.input-date-time-range.interactive-label": "Mewnbwn ystod dyddiad ac amser",
	"components.input-date-time-range.startDate": "Dyddiad Dechrau",
	"components.input-date-time-range-to.to": "i",
	"components.input-number.hintDecimalDuplicate": "Mae degolyn yn y rhif hwn eisoes",
	"components.input-number.hintDecimalIncorrectComma": "I ychwanegu degolyn defnyddiwch y nod coma “,”",
	"components.input-number.hintDecimalIncorrectPeriod": "I ychwanegu degolyn defnyddiwch y nod atalnod llawn “.”",
	"components.input-number.hintInteger": "Mae’r maes hwn yn derbyn gwerthoedd cyfanrif yn unig (dim degolion)",
	"components.input-search.clear": "Clirio’r Chwilio",
	"components.input-search.defaultPlaceholder": "Chwilio...",
	"components.input-search.search": "Chwilio",
	"components.input-time-range.endTime": "Amser Gorffen",
	"components.input-time-range.errorBadInput": "Rhaid i {startLabel} fod cyn {endLabel}",
	"components.input-time-range.startTime": "Amser Dechrau",
	"components.interactive.instructions": "Pwyswch Enter i ryngweithio, Escape i adael",
	"components.link.open-in-new-window": "Yn agor mewn ffenestr newydd",
	"components.list.keyboard": "Defnyddiwch y <b>bysellau saeth</b> i symud ffocws y tu mewn i’r rhestr hon, neu <b>tudalen i fyny/i lawr</b> i symud i fyny neu i lawr erbyn 5",
	"components.list-controls.label": "Camau gweithredu ar gyfer rhestr",
	"components.list-item.addItem": "Ychwanegu Eitem",
	"components.list-item-drag-handle.default": "Aildrefnu gweithred eitem ar gyfer {name}",
	"components.list-item-drag-handle.keyboard": "Aildrefnu eitemau, safle presennol {currentPosition} allan o {size}. I symud yr eitem hon, pwyswch y saeth i fyny neu’r saeth i lawr.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Toglo’r modd aildrefnu bysellfwrdd.",
	"components.list-item-drag-handle-tooltip.enter-key": "Nodi",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Newid y lefel nythu.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Chwith/De",
	"components.list-item-drag-handle-tooltip.title": "Rheolaethau bysellfwrdd ar gyfer aildrefnu:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Symud yr eitem i fyny neu i lawr yn y rhestr.",
	"components.list-item-drag-handle-tooltip.up-down-key": "I Fyny/I Lawr",
	"components.menu-item-return.return": "Dychwelyd i’r ddewislen flaenorol.",
	"components.menu-item-return.returnCurrentlyShowing": "Dychwelyd i’r ddewislen flaenorol. Rydych chi’n edrych ar {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} allan o {y}",
	"components.meter-mixin.progressIndicator": "Dangosydd Cynnydd",
	"components.more-less.less": "llai",
	"components.more-less.more": "mwy",
	"components.object-property-list.item-placeholder-text": "Eitem Dalfan",
	"components.overflow-group.moreActions": "Rhagor o Gamau Gweithredu",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} eitem}
			other {{countFormatted} o eitemau}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} o {totalCountFormatted} eitem}
			other {{countFormatted} o {totalCountFormatted} eitemau}
		}`,
	"components.pager-load-more.action": "Llwytho Mwy",
	"components.pager-load-more.action-with-page-size": "Lwytho {count} Arall",
	"components.pager-load-more.status-loading": "Llwytho rhagor o eitemau",
	"components.selection.action-max-hint":
		`{count, plural,
			one {Wedi’i analluogi pan fydd mwy nag {countFormatted} eitem yn cael ei ddewis}
			other {Wedi’i analluogi pan fydd mwy na {countFormatted} eitem yn cael eu dewis}
		}`,
	"components.selection.action-required-hint": "Rhaid i chi ddewis eitem i gyflawni’r weithred hon",
	"components.selection.select-all": "Dewis y Cyfan",
	"components.selection.select-all-items": "Dewis Pob {count} Eitem",
	"components.selection.selected": "{count} wedi’u dewis.",
	"components.selection.selected-plus": "{count}+ wedi’u dewis",
	"components.selection-controls.label": "Camau gweithredu ar gyfer detholiad",
	"components.sort.label": "Trefnu",
	"components.sort.text": "Trefnu: {selectedItemText}",
	"components.switch.conditions": "Rhaid bodloni’r amodau",
	"components.switch.hidden": "Cudd",
	"components.switch.visible": "Gweladwy",
	"components.switch.visibleWithPeriod": "Gweladwy.",
	"components.table-col-sort-button.addSortOrder": "Dewiswch i ychwanegu trefn ddidoli",
	"components.table-col-sort-button.changeSortOrder": "Dewiswch i newid trefn ddidoli",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Wedi didoli newydd i hen}
				other {Wedi didoli hen i newydd}
			}}
			numbers {{direction, select,
				desc {Wedi didoli uchel i isel}
				other {Wedi didoli isel i uchel}
			}}
			words {{direction, select,
				desc {Wedi didoli Z i A}
				other {Wedi didoli A i Z}
			}}
			value {Wedi didoli {selectedMenuItemText}}
			other {{direction, select,
				desc {Wedi didoli’n ddisgynnol}
				other {Wedi didoli’n esgynnol}
			}}
		}`,
	"components.table-controls.label": "Camau gweithredu ar gyfer y tabl",
	"components.tabs.next": "Sgrolio Ymlaen",
	"components.tabs.previous": "Sgrolio Yn Ôl",
	"components.tag-list.clear": "Cliciwch, pwyswch yn ôl, neu pwyswch y bysell dileu i dynnu’r eitem {value}",
	"components.tag-list.clear-all": "Clirio’r Cyfan",
	"components.tag-list.cleared-all": "Wedi tynnu’r holl eitemau rhestr tag.",
	"components.tag-list.cleared-item": "Wedi tynnu’r eitem rhestr tag {value}",
	"components.tag-list.interactive-label": "Rhestr Tag, {count} o eitemau",
	"components.tag-list.num-hidden": "+ {count} yn rhagor",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Rhestr Tagiau gyda 0 eitem}
			one {Rhestr Tagiau gyda {count} eitem}
			other {Rhestr Tagiau gyda {count} eitem}
		}`,
	"components.tag-list.show-less": "Dangos Llai",
	"components.tag-list.show-more-description": "Dewis i ddangos eitemau rhestr tag cudd",
	"components.tag-list-item.role-description": "Tag",
	"components.tag-list-item.tooltip-arrow-keys": "Byselli Saeth",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Symud rhwng tagiau",
	"components.tag-list-item.tooltip-delete-key": "Yn ôl/Dileu",
	"components.tag-list-item.tooltip-delete-key-desc": "Dileu’r tag â ffocws",
	"components.tag-list-item.tooltip-title": "Rheolyddion Bysellfwrdd",
	"templates.primary-secondary.divider": "Rhannwr panel eilaidd",
	"templates.primary-secondary.secondary-panel": "Panel eilaidd"
};
