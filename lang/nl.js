export default {
	"components.alert.close": "Waarschuwing sluiten",
	"components.breadcrumbs.breadcrumb": "Kruimelpad",
	"components.button-add.addItem": "Item toevoegen",
	"components.button-split.otherOptions": "Overige opties",
	"components.calendar.hasEvents": "Bevat gebeurtenissen.",
	"components.calendar.notSelected": "Niet geselecteerd.",
	"components.calendar.selected": "Geselecteerd.",
	"components.calendar.show": "{month} weergeven",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Dit dialoogvenster sluiten",
	"components.dialog.critical": "Kritiek!",
	"components.dropdown.close": "Sluiten",
	"components.filter.activeFilters": "Actieve filters:",
	"components.filter.additionalContentTooltip": "Gebruik <b>linker/rechter pijltjestoetsen</b> om de focus binnen dit lijstitem te verplaatsen",
	"components.filter.clear": "Wissen",
	"components.filter.clearAll": "Alles wissen",
	"components.filter.clearAllAnnounce": "Alle filters wissen",
	"components.filter.clearAllAnnounceOverride": "Alle filters worden gewist voor: {filterText}",
	"components.filter.clearAllDescription": "Alle filters wissen",
	"components.filter.clearAllDescriptionOverride": "Alle filters wissen voor: {filterText}",
	"components.filter.clearAnnounce": "Filters wissen voor {filterName}",
	"components.filter.clearDescription": "Filters wissen voor {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Geen filters toegepast.}
			one {{number} filter toegepast.}
			other {{number} filters toegepast.}
		}`,
	"components.filter.filters": "Filters",
	"components.filter.loading": "Laden van filters",
	"components.filter.noFilters": "Geen beschikbare filters",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Geen zoekresultaten}
			one {{number} zoekresultaat}
			other {{number} zoekresultaten}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Geselecteerde filters verschijnen als eerste.",
	"components.filter.singleDimensionDescription": "Filter op {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Vandaag}
			one {Afgelopen {num} dag}
			other {Afgelopen {num} dagen}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Afgelopen uur}
			other {Afgelopen {num} uur}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Afgelopen {num} maanden",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, vouw uit om datums te kiezen",
	"components.filter-dimension-set-date-time-range-value.text": "Aangepast datumbereik",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} tot {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Voor {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Na {startValue}",
	"components.form-element.defaultError": "{label} is ongeldig",
	"components.form-element.defaultFieldLabel": "Veld",
	"components.form-element.input.email.typeMismatch": "E-mailadres is ongeldig",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Getal moet groter zijn dan {min} en kleiner dan {max}.}
				other {Getal moet groter zijn dan {min} en kleiner dan of gelijk aan {max}.}
			}}
			other {{maxExclusive, select,
				true {Getal moet groter zijn dan of gelijk aan {min} en kleiner dan {max}.}
				other {Getal moet groter zijn dan of gelijk aan {min} en kleiner dan of gelijk aan {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Getal moet kleiner zijn dan {max}.}
			other {Getal moet kleiner zijn dan of gelijk aan {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Getal moet groter zijn dan {min}.}
			other {Getal moet groter zijn dan of gelijk aan {min}.}
		}`,
	"components.form-element.input.text.tooShort": "{label} moet ten minste {minlength} tekens bevatten",
	"components.form-element.input.url.typeMismatch": "URL is niet geldig",
	"components.form-element.valueMissing": "{label} is vereist",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Er is {count} fout gevonden in de informatie die u hebt ingediend}
			other {Er zijn {count} fouten gevonden in de informatie die u hebt ingediend}
		}`,
	"components.form-error-summary.text": "Foutdetails in-/uitschakelen",
	"components.input-color.backgroundColor": "Achtergrondkleur",
	"components.input-color.foregroundColor": "Voorgrondkleur",
	"components.input-color.none": "Geen",
	"components.input-date.clear": "Wissen",
	"components.input-date.errorMaxDateOnly": "Datum moet voor of op {maxDate} liggen",
	"components.input-date.errorMinDateOnly": "Datum moet op of na {minDate} liggen",
	"components.input-date.errorOutsideRange": "Datum moet tussen {minDate} en {maxDate} liggen",
	"components.input-date.now": "Nu",
	"components.input-date.openInstructions": "Gebruik datumnotatie {format}. Gebruik Pijl omlaag of druk op Enter om de mini-agenda te openen.",
	"components.input-date.revert": "{label} teruggezet naar vorige waarde.",
	"components.input-date.today": "Vandaag",
	"components.input-date.useDateFormat": "Gebruik datumnotatie {format}.",
	"components.input-date-range.endDate": "Einddatum",
	"components.input-date-range.errorBadInput": "{startLabel} moet voor {endLabel} liggen",
	"components.input-date-range.interactive-label": "Invoer datumbereik",
	"components.input-date-range.startDate": "Startdatum",
	"components.input-date-time.date": "Datum",
	"components.input-date-time.errorMaxDateOnly": "Datum moet voor of op {maxDate} liggen",
	"components.input-date-time.errorMinDateOnly": "Datum moet op of na {minDate} liggen",
	"components.input-date-time.errorOutsideRange": "Datum moet tussen {minDate} en {maxDate} liggen",
	"components.input-date-time.time": "Tijd",
	"components.input-date-time-range.endDate": "Einddatum",
	"components.input-date-time-range.errorBadInput": "{startLabel} moet voor {endLabel} liggen",
	"components.input-date-time-range.interactive-label": "Invoer datum- en tijdbereik",
	"components.input-date-time-range.startDate": "Startdatum",
	"components.input-date-time-range-to.to": "tot",
	"components.input-number.hintDecimalDuplicate": "Dit getal bevat al een decimaal",
	"components.input-number.hintDecimalIncorrectComma": "Als u een decimaal wilt toevoegen, gebruikt u het teken ‘,’",
	"components.input-number.hintDecimalIncorrectPeriod": "Als u een decimaal wilt toevoegen, gebruikt u de punt ‘.’",
	"components.input-number.hintInteger": "Dit veld accepteert alleen gehele getallen (geen decimalen)",
	"components.input-search.clear": "Zoekopdracht wissen",
	"components.input-search.defaultPlaceholder": "Zoeken...",
	"components.input-search.search": "Zoeken",
	"components.input-time-range.endTime": "Eindtijd",
	"components.input-time-range.errorBadInput": "{startLabel} moet voor {endLabel} liggen",
	"components.input-time-range.startTime": "Starttijd",
	"components.interactive.instructions": "Druk op Enter om te communiceren, druk op Escape om af te sluiten",
	"components.link.open-in-new-window": "Wordt geopend in een nieuw venster.",
	"components.list.keyboard": "Navigeer binnen deze lijst met behulp van de <b>pijltjestoetsen</b> of gebruik <b>pagina omhoog/omlaag</b> om steeds vijf plekken omhoog of omlaag te bewegen",
	"components.list-controls.label": "Acties voor lijst",
	"components.list-item.addItem": "Item toevoegen",
	"components.list-item-drag-handle.default": "Itemactie voor {name} opnieuw rangschikken",
	"components.list-item-drag-handle.keyboard": "Items opnieuw rangschikken, huidige positie {currentPosition} van {size}. Als u dit item wilt verplaatsen, drukt u op de pijl omhoog of omlaag.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Schuifregelaar voor modus Opnieuw ordenen van toetsenbord.",
	"components.list-item-drag-handle-tooltip.enter-key": "Invoeren",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Wijzig het nestniveau.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Links/rechts",
	"components.list-item-drag-handle-tooltip.title": "Toetsenbordknoppen voor opnieuw ordenen:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Verplaats item omhoog of omlaag in de lijst.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Omhoog/omlaag",
	"components.menu-item-return.return": "Keer terug naar het vorige menu.",
	"components.menu-item-return.returnCurrentlyShowing": "Keer terug naar het vorige menu. U bekijkt {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} van {y}",
	"components.meter-mixin.progressIndicator": "Voortgangsindicator",
	"components.more-less.less": "minder",
	"components.more-less.more": "meer",
	"components.object-property-list.item-placeholder-text": "Item tijdelijke aanduiding",
	"components.overflow-group.moreActions": "Meer acties",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} item}
			other {{countFormatted} items}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} van {totalCountFormatted} artikel}
			other {{countFormatted} van {totalCountFormatted} artikelen}
		}`,
	"components.pager-load-more.action": "Meer laden",
	"components.pager-load-more.action-with-page-size": "Laad nog {count} extra",
	"components.pager-load-more.status-loading": "Er worden meer items geladen",
	"components.selection.action-max-hint":
		`{count, plural,
			one {Uitgeschakeld als meer dan {countFormatted} item is geselecteerd}
			other {Uitgeschakeld als meer dan {countFormatted} items zijn geselecteerd}
		}`,
	"components.selection.action-required-hint": "Selecteer een item om deze actie uit te voeren",
	"components.selection.select-all": "Alles selecteren",
	"components.selection.select-all-items": "Alle {count} records selecteren",
	"components.selection.selected": "{count} geselecteerd",
	"components.selection.selected-plus": "Meer dan {count} geselecteerd",
	"components.selection-controls.label": "Acties voor selectie",
	"components.sort.label": "Sorteren",
	"components.sort.text": "Sorteren: {selectedItemText}",
	"components.switch.conditions": "Er moet aan de voorwaarden worden voldaan",
	"components.switch.hidden": "Verborgen",
	"components.switch.visible": "Zichtbaar",
	"components.switch.visibleWithPeriod": "Zichtbaar.",
	"components.table-col-sort-button.addSortOrder": "Selecteer toe te voegen sorteervolgorde",
	"components.table-col-sort-button.changeSortOrder": "Selecteer te wijzigen sorteervolgorde",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Gesorteerd van nieuw naar oud}
				other {Gesorteerd van oud naar nieuw}
			}}
			numbers {{direction, select,
				desc {Gesorteerd van hoog naar laag}
				other {Gesorteerd van laag naar hoog}
			}}
			words {{direction, select,
				desc {Gesorteerd van A naar Z}
				other {Gesorteerd van Z naar A}
			}}
			value {Gesorteerd op {selectedMenuItemText}}
			other {{direction, select,
				desc {Aflopend gesorteerd}
				other {Oplopend gesorteerd}
			}}
		}`,
	"components.table-controls.label": "Acties voor tabel",
	"components.tabs.next": "Naar voren scrollen",
	"components.tabs.previous": "Naar achteren scrollen",
	"components.tag-list.clear": "Klik, druk op Backspace of druk op de Delete-toets om item {value} te verwijderen",
	"components.tag-list.clear-all": "Alles wissen",
	"components.tag-list.cleared-all": "Alle items op de labellijst zijn verwijderd",
	"components.tag-list.cleared-item": "Item {value} op de labellijst is verwijderd",
	"components.tag-list.interactive-label": "Labellijst, {count} items",
	"components.tag-list.num-hidden": "+ {count} extra",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Taglijst met 0 items}
			one {Taglijst met {count} item}
			other {Taglijst met {count} items}
		}`,
	"components.tag-list.show-less": "Minder weergeven",
	"components.tag-list.show-more-description": "Selecteer deze optie om verborgen items op labellijsten weer te geven",
	"components.tag-list-item.role-description": "Label",
	"components.tag-list-item.tooltip-arrow-keys": "Pijltoetsen",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Schakelen tussen tags",
	"components.tag-list-item.tooltip-delete-key": "Backspace/Verwijderen",
	"components.tag-list-item.tooltip-delete-key-desc": "Verwijder de gerichte tag",
	"components.tag-list-item.tooltip-title": "Bedieningselementen op het toetsenbord",
	"templates.primary-secondary.divider": "Scheidingslijn secundair venster",
	"templates.primary-secondary.secondary-panel": "Secundair venster"
};
