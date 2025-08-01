export default {
	"components.alert.close": "Luk besked",
	"components.breadcrumbs.breadcrumb": "Brødkrumme",
	"components.button-add.addItem": "Tilføj element",
	"components.button-split.otherOptions": "Andre indstillinger",
	"components.calendar.hasEvents": "Har begivenheder.",
	"components.calendar.notSelected": "Ikke valgt.",
	"components.calendar.selected": "Valgt.",
	"components.calendar.show": "Vis {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Luk denne dialogboks",
	"components.dialog.critical": "Kritisk!",
	"components.dropdown.close": "Luk",
	"components.filter.activeFilters": "Aktive filtre:",
	"components.filter.additionalContentTooltip": "Brug <b>venstre/højre piletaster</b> til at flytte fokus inden for dette listeelement",
	"components.filter.clear": "Ryd",
	"components.filter.clearAll": "Ryd alle",
	"components.filter.clearAllAnnounce": "Rydder alle filtre",
	"components.filter.clearAllAnnounceOverride": "Rydder alle filtre for: {filterText}",
	"components.filter.clearAllDescription": "Ryd alle filtre",
	"components.filter.clearAllDescriptionOverride": "Ryd alle filtre for: {filterText}",
	"components.filter.clearAnnounce": "Rydder filtre for:{filterName}",
	"components.filter.clearDescription": "Ryd filtre for: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Ingen filtre anvendt.}
			one {{number} filter anvendt.}
			other {{number} filtre anvendt.}
		}`,
	"components.filter.filters": "Filtre",
	"components.filter.loading": "Indlæser filtre",
	"components.filter.noFilters": "Ingen tilgængelige filtre",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Ingen søgeresultater}
			one {{number} søgeresultat}
			other {{number} søgeresultater}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Valgte filtre vises først.",
	"components.filter.singleDimensionDescription": "Filtrer efter: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {I dag}
			one {Sidste {num} dag}
			other {Sidste {num} dage}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Sidste time}
			other {Sidste {num} timer}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Sidste {num} måneder",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, udvid for at vælge datoer",
	"components.filter-dimension-set-date-time-range-value.text": "Brugerdefineret datointerval",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} til {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Før {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Efter {startValue}",
	"components.form-element.defaultError": "{label} er ugyldigt",
	"components.form-element.defaultFieldLabel": "Felt",
	"components.form-element.input.email.typeMismatch": "E-mail er ikke gyldig",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Tallet skal være større end {min} og mindre end {max}.}
				other {Tallet skal være større end {min} og mindre eller lig med {max}.}
			}}
			other {{maxExclusive, select,
				true {Tallet skal være større end eller lig med {min} og mindre end {max}.}
				other {Tallet skal være større end eller lig med {min} og mindre end eller lig med {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Tallet skal være mindre end {max}.}
			other {Tallet skal være mindre end eller lig med {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Tallet skal være større end {min}.}
			other {Tallet skal være større end eller lig med {min}.}
		}`,
	"components.form-element.input.text.tooShort": "{label} skal være på mindst {minlength} tegn",
	"components.form-element.input.url.typeMismatch": "URL-adresse er ikke gyldig",
	"components.form-element.valueMissing": "{label} er påkrævet",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Der blev fundet {count} fejl i de oplysninger, du indsendte}
			other {Der blev fundet {count} fejl i de oplysninger, du indsendte}
		}`,
	"components.form-error-summary.text": "Slå fejloplysninger til/fra",
	"components.input-color.backgroundColor": "Baggrundsfarve",
	"components.input-color.foregroundColor": "Forgrundsfarve",
	"components.input-color.none": "Ingen",
	"components.input-date.clear": "Ryd",
	"components.input-date.errorMaxDateOnly": "Datoen skal være den {maxDate} eller tidligere",
	"components.input-date.errorMinDateOnly": "Datoen skal være den {minDate} eller senere",
	"components.input-date.errorOutsideRange": "Datoen skal være mellem {minDate} og {maxDate}",
	"components.input-date.now": "Nu",
	"components.input-date.openInstructions": "Brug datoformatet {format}. Tryk på Pil ned eller Enter for at få adgang til minikalender.",
	"components.input-date.revert": "{label} vendte tilbage til tidligere værdi.",
	"components.input-date.today": "I dag",
	"components.input-date.useDateFormat": "Brug datoformatet {format}.",
	"components.input-date-range.endDate": "Slutdato",
	"components.input-date-range.errorBadInput": "{startLabel} skal være før {endLabel}",
	"components.input-date-range.interactive-label": "Angivelse af datointerval",
	"components.input-date-range.startDate": "Startdato",
	"components.input-date-time.date": "Dato",
	"components.input-date-time.errorMaxDateOnly": "Datoen skal være den {maxDate} eller tidligere",
	"components.input-date-time.errorMinDateOnly": "Datoen skal være den {minDate} eller senere",
	"components.input-date-time.errorOutsideRange": "Datoen skal være mellem {minDate} og {maxDate}",
	"components.input-date-time.time": "Tid",
	"components.input-date-time-range.endDate": "Slutdato",
	"components.input-date-time-range.errorBadInput": "{startLabel} skal være før {endLabel}",
	"components.input-date-time-range.interactive-label": "Angivelse af dato- og tidsinterval",
	"components.input-date-time-range.startDate": "Startdato",
	"components.input-date-time-range-to.to": "til",
	"components.input-number.hintDecimalDuplicate": "Der er allerede en decimal i dette tal",
	"components.input-number.hintDecimalIncorrectComma": "Hvis du vil tilføje en decimal, skal du bruge komma-tegnet “,”",
	"components.input-number.hintDecimalIncorrectPeriod": "Hvis du vil tilføje en decimal, skal du bruge punktum-tegnet “.”",
	"components.input-number.hintInteger": "Dette felt accepterer kun heltalsværdier (ingen decimaler)",
	"components.input-search.clear": "Ryd søgning",
	"components.input-search.defaultPlaceholder": "Søg ...",
	"components.input-search.search": "Søg",
	"components.input-time-range.endTime": "Sluttidspunkt",
	"components.input-time-range.errorBadInput": "{startLabel} skal være før {endLabel}",
	"components.input-time-range.startTime": "Starttidspunkt",
	"components.interactive.instructions": "Tryk på Enter for at interagere, Escape for at afslutte",
	"components.link.open-in-new-window": "Åbnes i et nyt vindue.",
	"components.list.keyboard": "Brug <b>piletasterne</b> til at flytte fokus inden for denne liste, eller <b>page up/down</b> til at flytte op eller ned med 5",
	"components.list-controls.label": "Handlinger for liste",
	"components.list-item.addItem": "Tilføj element",
	"components.list-item-drag-handle.default": "Omarranger elementhandling for {name}",
	"components.list-item-drag-handle.keyboard": "Omarranger element, aktuel position {currentPosition} ud af {size}. For at flytte dette element skal du trykke på pil op eller pil ned.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Skift tilstand for omorganisering af tastatur.",
	"components.list-item-drag-handle-tooltip.enter-key": "Indtast",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Skift indlejringsniveauet.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Venstre/højre",
	"components.list-item-drag-handle-tooltip.title": "Tastaturkontrolelementer for omorganisering:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Flyt element op eller ned på listen.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Op/ned",
	"components.menu-item-return.return": "Gå tilbage til forrige menu.",
	"components.menu-item-return.returnCurrentlyShowing": "Gå tilbage til forrige menu. Du ser på {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} af {y}",
	"components.meter-mixin.progressIndicator": "Statusindikator",
	"components.more-less.less": "færre",
	"components.more-less.more": "flere",
	"components.object-property-list.item-placeholder-text": "Pladsholder-element",
	"components.overflow-group.moreActions": "Flere handlinger",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} element}
			other {{countFormatted} elementer}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} af {totalCountFormatted} element}
			other {{countFormatted} af {totalCountFormatted} elementer}
		}`,
	"components.pager-load-more.action": "Indlæs flere",
	"components.pager-load-more.action-with-page-size": "Indlæs {count} mere",
	"components.pager-load-more.status-loading": "Indlæser flere elementer",
	"components.selection.action-max-hint":
		`{count, plural,
			one {Deaktiveret, når mere end {countFormatted} element er valgt}
			other {Deaktiveret, når mere end {countFormatted} elementer er valgt}
		}`,
	"components.selection.action-required-hint": "Vælg et element for at udføre denne handling",
	"components.selection.select-all": "Vælg alle",
	"components.selection.select-all-items": "Vælg alle {count} elementer",
	"components.selection.selected": "{count} valgt",
	"components.selection.selected-plus": "{count}+ valgt",
	"components.selection-controls.label": "Handlinger for valg",
	"components.sort.label": "Sortér",
	"components.sort.text": "Sortér: {selectedItemText}",
	"components.switch.conditions": "Betingelserne skal være opfyldt",
	"components.switch.hidden": "Skjult",
	"components.switch.visible": "Synlig",
	"components.switch.visibleWithPeriod": "Synlig.",
	"components.table-col-sort-button.addSortOrder": "Vælg for at tilføje sorteringsrækkefølge",
	"components.table-col-sort-button.changeSortOrder": "Vælg for at ændre sorteringsrækkefølge",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Sorteret ny til gammel}
				other {Sorteret gammel til ny}
			}}
			numbers {{direction, select,
				desc {Sorteret høj til lav}
				other {Sorteret lav til høj}
			}}
			words {{direction, select,
				desc {Sorteret Z til A}
				other {Sorteret A til Z}
			}}
			value {Sorteret {selectedMenuItemText}}
			other {{direction, select,
				desc {Sorteret faldende}
				other {Sorteret stigende}
			}}
		}`,
	"components.table-controls.label": "Handlinger for tabel",
	"components.tabs.next": "Rul frem",
	"components.tabs.previous": "Rul tilbage",
	"components.tag-list.clear": "Klik, tryk på tilbagetasten, eller tryk på slettasten for at fjerne element {value}",
	"components.tag-list.clear-all": "Ryd alle",
	"components.tag-list.cleared-all": "Fjernede alle taglisteelementer",
	"components.tag-list.cleared-item": "Fjernede taglisteelement {value}",
	"components.tag-list.interactive-label": "Tagliste, {count} elementer",
	"components.tag-list.num-hidden": "+ {count} mere",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Tagliste med 0 elementer}
			one {Tagliste med {count} element}
			other {Tagliste med {count} elementer}
		}`,
	"components.tag-list.show-less": "Vis færre",
	"components.tag-list.show-more-description": "Vælg for at få vist skjulte taglisteelementer",
	"components.tag-list-item.role-description": "Tag",
	"components.tag-list-item.tooltip-arrow-keys": "Piletaster",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Flyt mellem tags",
	"components.tag-list-item.tooltip-delete-key": "Tilbage/Slet",
	"components.tag-list-item.tooltip-delete-key-desc": "Slet det fokuserede tag",
	"components.tag-list-item.tooltip-title": "Kontrolelementer på tastaturet",
	"templates.primary-secondary.divider": "Sekundær panelskillelinje",
	"templates.primary-secondary.secondary-panel": "Sekundært panel"
};
