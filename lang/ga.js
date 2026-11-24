export default {
	"components.alert.close": "Dún an foláireamh",
	"components.backdrop-loading.loadingAnnouncement": "Ag luchtú.",
	"components.backdrop-loading.loadingCompleteAnnouncement": "Luchtú Críochnaithe.",
	"components.backdrop-stale-overlay.message": "Tá an t-eolas seo as dáta.",
	"components.breadcrumbs.breadcrumb": "Rian Loirg",
	"components.button-add.addItem": "Cuir mír leis",
	"components.button-copy.copied": "Cóipeáilte!",
	"components.button-copy.error": "Theip ar an gcóipeáil. Bain triail eile as, nó bain triail as cóipeáil de láimh.",
	"components.button-split.otherOptions": "Roghanna Eile",
	"components.calendar.hasEvents": "Tá Imeachtaí Ann",
	"components.calendar.notSelected": "Gan roghnú.",
	"components.calendar.selected": "Roghnaithe.",
	"components.calendar.show": "Taispeáin {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Dún an dialóg seo",
	"components.dialog.critical": "Criticiúil!",
	"components.dropdown.close": "Dún",
	"components.filter.activeFilters": "Scagairí Gníomhacha:",
	"components.filter.additionalContentTooltip": "Úsáid na heochracha saigheada <b>chlé/dheis</b> chun fócas a bhogadh taobh istigh den mhír liosta seo",
	"components.filter.clear": "Glan",
	"components.filter.clearAll": "Glan gach rud",
	"components.filter.clearAllAnnounce": "Gach scagaire á ghlanadh",
	"components.filter.clearAllAnnounceOverride": "Gach scagaire á ghlanadh le haghaidh: {filterText}",
	"components.filter.clearAllDescription": "Glan na scagairí go léir",
	"components.filter.clearAllDescriptionOverride": "Glan na scagairí go léir le haghaidh: {filterText}",
	"components.filter.clearAnnounce": "Scagairí a ghlanadh le haghaidh: {filterName}",
	"components.filter.clearDescription": "Glan scagairí le haghaidh: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Níor cuireadh aon scagaire i bhfeidhm.}
			one {{number} scagaire curtha i bhfeidhm.}
			two {{number} scagaire curtha i bhfeidhm.}
			few {{number} scagaire curtha i bhfeidhm.}
			many {{number} scagaire curtha i bhfeidhm.}
			other {{number} scagairí curtha i bhfeidhm.}
		}`,
	"components.filter.filters": "Scagairí",
	"components.filter.loading": "Scagairí á luchtú",
	"components.filter.noFilters": "Gan scagairí ar fáil",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Gan torthaí cuardaigh}
			one {{number} toradh cuardaigh}
			two {{number} thoradh cuardaigh}
			few {{number} thoradh cuardaigh}
			many {{number} dtoradh cuardaigh}
			other {{number} torthaí cuardaigh}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Taispeántar na scagairí roghnaithe ar dtús.",
	"components.filter.singleDimensionDescription": "Scag de réir: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Inniu}
			=2 {Na {num} lá dheireanacha}
			one {An lá {num} dheireanach}
			few {Na {num} lá dheireanacha}
			many {Na {num} lá dheireanacha}
			other {Na {num} lá dheireanacha}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {An uair dheireanach}
			=2 {Na {num} uair an chloig dheireanacha}
			few {Na {num} uair an chloig dheireanacha}
			many {Na {num} uair an chloig dheireanacha}
			other {Na {num} uair an chloig dheireanacha}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "{num} mhí anuas",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, leathnaigh chun dátaí a roghnú",
	"components.filter-dimension-set-date-time-range-value.text": "Raon dáta saincheaptha",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} go {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Roimh {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Tar éis {startValue}",
	"components.form-element.defaultError": "Tá {label} neamhbhailí",
	"components.form-element.defaultFieldLabel": "Réimse",
	"components.form-element.input.email.typeMismatch": "Níl an ríomhphost bailí",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Caithfidh an uimhir a bheith níos mó ná {min} agus níos lú ná {max}.}
				other {Caithfidh an uimhir a bheith níos mó ná {min} agus níos lú ná nó cothrom le {max}.}
			}}
			other {{maxExclusive, select,
				true {Caithfidh an uimhir a bheith níos mó ná nó cothrom le {min} agus níos lú ná {max}.}
				other {Caithfidh an uimhir a bheith níos mó ná nó cothrom le {min} agus níos lú ná nó cothrom le {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Caithfidh an uimhir a bheith níos lú ná {max}.}
			other {Caithfidh an uimhir a bheith níos lú ná nó cothrom le {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Caithfidh an uimhir a bheith níos mó ná {min}.}
			other {Caithfidh an uimhir a bheith níos mó ná nó cothrom le {min}.}
		}`,
	"components.form-element.input.text.tooShort": "Ní mór {label} a bheith ar a laghad {minlength} carachtair",
	"components.form-element.input.url.typeMismatch": "Níl an URL bailí",
	"components.form-element.valueMissing": "Tá {label} riachtanach",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			=2 {Fuarthas {count} earráidí san fhaisnéis a chuir tú isteach}
			one {Fuarthas {count} earráid san fhaisnéis a chuir tú isteach}
			few {Fuarthas {count} earráidí san fhaisnéis a chuir tú isteach}
			many {Fuarthas {count} earráidí san fhaisnéis a chuir tú isteach}
			other {Fuarthas {count} earráidí san fhaisnéis a chuir tú isteach}
		}`,
	"components.form-error-summary.text": "Scoránaigh mionsonraí earráide",
	"components.input-color.backgroundColor": "Dath Cúlra",
	"components.input-color.foregroundColor": "Dath Réamhra",
	"components.input-color.none": "Ceann ar bith",
	"components.input-date.clear": "Glan",
	"components.input-date.errorMaxDateOnly": "Ní mór an dáta a bheith roimh nó ar {maxDate}",
	"components.input-date.errorMinDateOnly": "Ní mór an dáta a bheith ar {minDate} nó ina dhiaidh",
	"components.input-date.errorOutsideRange": "Ní mór go mbeadh an dáta idir {minDate} agus {maxDate}",
	"components.input-date.now": "Anois",
	"components.input-date.openInstructions": "Úsáid formáid dháta {format}. Brúigh an saighead síos nó brúigh isteach chun rochtain a fháil ar an bhféilire beag.",
	"components.input-date.revert": "{label} curtha ar ais go dtí an luach roimhe seo.",
	"components.input-date.today": "Inniu",
	"components.input-date.useDateFormat": "Úsáid formáid dháta {format}.",
	"components.input-date-range.endDate": "Dáta Deiridh",
	"components.input-date-range.errorBadInput": "Ní mór {startLabel} a bheith roimh {endLabel}",
	"components.input-date-range.interactive-label": "Ionchur raon dáta",
	"components.input-date-range.startDate": "Dáta Tosaigh",
	"components.input-date-time.date": "Dáta",
	"components.input-date-time.errorMaxDateOnly": "Ní mór an dáta a bheith roimh nó ar {maxDate}",
	"components.input-date-time.errorMinDateOnly": "Ní mór an dáta a bheith ar {minDate} nó ina dhiaidh",
	"components.input-date-time.errorOutsideRange": "Ní mór go mbeadh an dáta idir {minDate} agus {maxDate}",
	"components.input-date-time.time": "Am",
	"components.input-date-time-range.endDate": "Dáta Deiridh",
	"components.input-date-time-range.errorBadInput": "Ní mór {startLabel} a bheith roimh {endLabel}",
	"components.input-date-time-range.interactive-label": "Ionchur dáta agus ama",
	"components.input-date-time-range.startDate": "Dáta Tosaigh",
	"components.input-date-time-range-to.to": "go",
	"components.input-number.hintDecimalDuplicate": "Tá deachúlach san uimhir seo cheana féin",
	"components.input-number.hintDecimalIncorrectComma": "Chun deachúlach a chur leis, bain úsáid as an gcarachtar camóg “,”",
	"components.input-number.hintDecimalIncorrectPeriod": "Chun deachúlach a chur leis, bain úsáid as an gcarachtar ponc “.”.",
	"components.input-number.hintInteger": "Ní ghlacann an réimse seo ach luachanna slánuimhreacha (gan deachúlacha)",
	"components.input-search.clear": "Glan an cuardach",
	"components.input-search.defaultPlaceholder": "Cuardaigh...",
	"components.input-search.search": "Cuardaigh",
	"components.input-time-range.endTime": "Am Deiridh",
	"components.input-time-range.errorBadInput": "Ní mór {startLabel} a bheith roimh {endLabel}",
	"components.input-time-range.startTime": "Am Tosaigh",
	"components.interactive.instructions": "Brúigh Iontráil chun idirghníomhú, Éalú chun imeacht",
	"components.link.open-in-new-window": "Osclaíonn sé i bhfuinneog nua.",
	"components.list.keyboard": "Úsáid <b>na heochracha saigheada</b> chun fócas a bhogadh taobh istigh den liosta seo, nó <b>leathanach suas/síos</b> chun bogadh suas nó síos 5",
	"components.list-controls.label": "Gníomhartha don liosta",
	"components.list-item.addItem": "Cuir mír leis",
	"components.list-item-drag-handle.default": "Gníomh athordaithe míre le haghaidh {name}",
	"components.list-item-drag-handle.keyboard": "Athordaigh mír, suíomh reatha {currentPosition} as {size}. Chun an mhír seo a bhogadh, brúigh na saigheada suas nó anuas.",
	"components.list-item-drag-handle.side-to-side.keyboard": "Athordaigh mír, suíomh reatha {currentPosition} as {size}. Chun an mhír seo a bhogadh, brúigh na saigheada ar chlé nó ar dheis.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Scoránaigh mód athordaithe an mhéarchláir.",
	"components.list-item-drag-handle-tooltip.enter-key": "Iontráil",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Athraigh an leibhéal neadaithe.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Clé/Deas",
	"components.list-item-drag-handle-tooltip.side-to-side.left-right-desc": "Bog an mhír ar chlé nó ar dheis sa liosta.",
	"components.list-item-drag-handle-tooltip.side-to-side.up-down-desc": "Bog an mhír ar chlé nó ar dheis sa liosta.",
	"components.list-item-drag-handle-tooltip.title": "Rialuithe Méarchláir le haghaidh Athordú:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Bog an mhír suas nó síos sa liosta.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Suas/Síos",
	"components.menu-item-return.return": "Fill ar an roghchlár roimhe seo.",
	"components.menu-item-return.returnCurrentlyShowing": "Fill ar an roghchlár roimhe seo. Tá tú ag féachaint ar {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} de {y}",
	"components.meter-mixin.progressIndicator": "Táscaire Dul Chun Cinn",
	"components.more-less.less": "níos lú",
	"components.more-less.more": "níos mó",
	"components.object-property-list.item-placeholder-text": "Mír ionaid",
	"components.overflow-group.moreActions": "Tuilleadh Gníomhartha",
	"components.page.footer-region-label": "Bunlíne",
	"components.page.header-nav-label": "Príomh",
	"components.page.side-nav-divider-label": "Deighilteoir Nascleanúna Taobh",
	"components.page.side-nav-label": "Taobh",
	"components.page.side-nav-scrim": "Tá an príomhábhar faoi cheilt faoi láthair ag an bPainéal Nascleanúna Taobh. Dún an painéal chun rochtain a fháil.",
	"components.page.supporting-divider-label": "Deighilteoir an Phainéil Tacaíochta",
	"components.page.supporting-label": "Tacaíocht",
	"components.page.supporting-scrim": "Tá an príomhábhar faoi cheilt ag an bPainéal Tacaíochta faoi láthair. Dún an painéal chun rochtain a fháil.",
	"components.pageable.info":
		`{count, plural,
			=2 {{countFormatted} míreanna}
			one {{countFormatted} mír}
			few {{countFormatted} míreanna}
			many {{countFormatted} míreanna}
			other {{countFormatted} míreanna}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			=2 {{countFormatted} as{totalCountFormatted} míreanna}
			one {{countFormatted} as {totalCountFormatted} mhír}
			few {{countFormatted} as {totalCountFormatted} míreanna}
			many {{countFormatted} as{totalCountFormatted} míreanna}
			other {{countFormatted} as{totalCountFormatted} míreanna}
		}`,
	"components.pager-load-more.action": "Luchtaigh Tuilleadh",
	"components.pager-load-more.action-with-page-size": "Luchtaigh {count} níos mó",
	"components.pager-load-more.status-loading": "Tuilleadh earraí á luchtú",
	"components.scroll-wrapper.scroll-left": "Scrollaigh ar chlé",
	"components.scroll-wrapper.scroll-right": "Scrollaigh ar dheis",
	"components.selection.action-max-hint":
		`{count, plural,
			=2 {Díchumasaithe nuair a roghnaítear níos mó ná {countFormatted}mhír}
			one {Díchumasaithe nuair a roghnaítear níos mó ná {countFormatted} mhír}
			few {Díchumasaithe nuair a roghnaítear níos mó ná {countFormatted} mhír}
			many {Díchumasaithe nuair a roghnaítear níos mó ná {countFormatted} mhír}
			other {Díchumasaithe nuair a roghnaítear níos mó ná {countFormatted} mhír}
		}`,
	"components.selection.action-required-hint": "Roghnaigh mír chun an gníomh seo a dhéanamh",
	"components.selection.select-all": "Roghnaigh Uile",
	"components.selection.select-all-items":
		`{count, plural,
			=1 {Roghnaigh mír}
			=2 {Roghnaigh na {countFormatted} mír go léir}
			few {Roghnaigh na {countFormatted} mír go léir}
			many {Roghnaigh na {countFormatted} mír go léir}
			other {Roghnaigh na {countFormatted} mír go léir}
		}`,
	"components.selection.selected": "{count} roghnaithe",
	"components.selection.selected-plus": "{count}+ roghnaithe",
	"components.selection-controls.label": "Gníomhartha le haghaidh roghnaithe",
	"components.skip-nav.skipToMainContent": "scipeáil chuig an bpríomhábhar",
	"components.sort.label": "Sórtáil",
	"components.sort.text": "Sórtáil: {selectedItemText}",
	"components.switch.conditions": "Ní mór coinníollacha a chomhlíonadh",
	"components.switch.hidden": "Folaithe",
	"components.switch.visible": "Infheicthe",
	"components.switch.visibleWithPeriod": "Infheicthe.",
	"components.table-col-sort-button.addSortOrder": "Roghnaigh chun ordú sórtála a chur leis",
	"components.table-col-sort-button.changeSortOrder": "Roghnaigh chun ordú sórtála a athrú",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Sórtáilte ó nua go sean}
				other {Sórtáilte ó shean go nua}
			}}
			numbers {{direction, select,
				desc {Sórtáilte ó ard go híseal}
				other {Sórtáilte ó íseal go hard}
			}}
			words {{direction, select,
				desc {Sórtáilte ó Z go A}
				other {Sórtáilte ó A go Z}
			}}
			value {Sórtáilte: {selectedMenuItemText}}
			other {{direction, select,
				desc {Sórtáilte in ord íslitheach}
				other {Sórtáilte in ord ardaitheach}
			}}
		}`,
	"components.table-controls.label": "Gníomhartha don tábla",
	"components.tabs.next": "Scrolláil ar Aghaidh",
	"components.tabs.previous": "Scrollaigh Siar",
	"components.tag-list.clear": "Cliceáil, brúigh backspace, nó brúigh an eochair \"Scrios\" chun mír {value} a bhaint",
	"components.tag-list.clear-all": "Glan gach rud",
	"components.tag-list.cleared-all": "Baineadh gach mír liosta clibeanna",
	"components.tag-list.cleared-item": "Baineadh mír liosta clibeanna {value}",
	"components.tag-list.interactive-label": "Liosta Clibeanna, {count} míreanna",
	"components.tag-list.num-hidden": "+ {count} eile",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Liosta Clibeanna ina bhfuil 0 mír}
			=2 {Liosta Clibeanna ina bhfuil {count} míreanna}
			one {Liosta Clibeanna ina bhfuil {count} mhír}
			few {Liosta Clibeanna ina bhfuil {count} míreanna}
			many {Liosta Clibeanna ina bhfuil {count} míreanna}
			other {Liosta Clibeanna ina bhfuil {count} míreanna}
		}`,
	"components.tag-list.show-less": "Taispeáin níos lú",
	"components.tag-list.show-more-description": "Roghnaigh chun míreanna liosta clibeanna i bhfolach a thaispeáint",
	"components.tag-list-item.role-description": "Clib",
	"components.tag-list-item.tooltip-arrow-keys": "Eochracha Saigheada",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Bog idir clibeanna",
	"components.tag-list-item.tooltip-delete-key": "Cúlspas/Scrios",
	"components.tag-list-item.tooltip-delete-key-desc": "Scrios an clib fócais",
	"components.tag-list-item.tooltip-title": "Rialuithe Méarchláir",
	"components.view-switcher.role-description":
		`{count, plural,
			=0 {Malartóir Amhairc ina bhfuil 0 mír}
			=2 {Malartóir Amhairc ina bhfuil {count} míreanna}
			one {Malartóir Amhairc ina bhfuil {count} mhír}
			few {Malartóir Amhairc ina bhfuil {count} míreanna}
			many {Malartóir Amhairc ina bhfuil {count} míreanna}
			other {Malartóir Amhairc ina bhfuil {count} míreanna}
		}`,
	"templates.primary-secondary.divider": "Deighilteoir an Phainéil Thánaistigh",
	"templates.primary-secondary.secondary-panel": "Painéal tánaisteach"
};
