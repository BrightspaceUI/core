export default {
	"components.alert.close": "Stängningsvarning",
	"components.breadcrumbs.breadcrumb": "Sökväg",
	"components.button-add.addItem": "Lägg till objekt",
	"components.button-split.otherOptions": "Andra alternativ",
	"components.calendar.hasEvents": "Har händelser.",
	"components.calendar.notSelected": "Inte vald.",
	"components.calendar.selected": "Markerad.",
	"components.calendar.show": "Visa {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Stäng dialogrutan",
	"components.dialog.critical": "Viktigt!",
	"components.dropdown.close": "Stäng",
	"components.filter.activeFilters": "Aktiva filter:",
	"components.filter.additionalContentTooltip": "Använd <b>piltangenterna</b> för att flytta fokus i det här listobjektet",
	"components.filter.clear": "Rensa",
	"components.filter.clearAll": "Rensa alla",
	"components.filter.clearAllAnnounce": "Rensar alla filter",
	"components.filter.clearAllAnnounceOverride": "Rensar alla filter för {filterText}",
	"components.filter.clearAllDescription": "Rensa alla filter",
	"components.filter.clearAllDescriptionOverride": "Rensa alla filter för {filterText}",
	"components.filter.clearAnnounce": "Rensar filter för {filterName}",
	"components.filter.clearDescription": "Rensa filter för {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Inga filter tillämpade.}
			one {{number} filter tillämpat.}
			other {{number} filter tillämpade.}
		}`,
	"components.filter.filters": "Filter",
	"components.filter.loading": "Läser in filter",
	"components.filter.noFilters": "Inga tillgängliga filter",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Inga sökresultat}
			one {{number} sökresultat}
			other {{number} sökresultat}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Valda filter visas först.",
	"components.filter.singleDimensionDescription": "Filtrera efter: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Idag}
			one {Senaste {num} dagen}
			other {Senaste {num} dagarna}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Senaste timmen}
			other {Senaste {num} timmarna}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Senaste {num} månaderna",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, expandera för att välja datum",
	"components.filter-dimension-set-date-time-range-value.text": "Eget datumintervall",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} till {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Före {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Efter {startValue}",
	"components.form-element.defaultError": "{label} är ogiltig",
	"components.form-element.defaultFieldLabel": "Fält",
	"components.form-element.input.email.typeMismatch": "E-postadressen är ogiltig",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Siffran ska vara högre än {min} och lägre än {max}.}
				other {Siffran ska vara högre än {min} och lägre än eller exakt {max}.}
			}}
			other {{maxExclusive, select,
				true {Siffran ska vara högre än eller exakt {min} och lägre än {max}.}
				other {Siffran ska vara högre än eller exakt {min} och lägre än eller exakt {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Siffran ska vara lägre än {max}.}
			other {Siffran ska vara lägre än eller exakt {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Siffran ska vara högre än {min}.}
			other {Siffran ska vara högre än eller exakt {min}.}
		}`,
	"components.form-element.input.text.tooShort": "{label} måste innehålla minst {minlength} tecken",
	"components.form-element.input.url.typeMismatch": "URL är inte giltigt",
	"components.form-element.valueMissing": "{label} krävs",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Det finns {count} fel i informationen som du skickade}
			other {Det finns {count} fel i informationen som du skickade}
		}`,
	"components.form-error-summary.text": "Växla felinformation",
	"components.input-color.backgroundColor": "Bakgrundsfärg",
	"components.input-color.foregroundColor": "Förgrundsfärg",
	"components.input-color.none": "Inga",
	"components.input-date.clear": "Rensa",
	"components.input-date.errorMaxDateOnly": "Datumet måste vara {maxDate} eller tidigare",
	"components.input-date.errorMinDateOnly": "Datumet måste vara {minDate} eller senare",
	"components.input-date.errorOutsideRange": "Datumet ska vara mellan {minDate} och {maxDate}",
	"components.input-date.now": "Nu",
	"components.input-date.openInstructions": "Använd datumformatet {format}. Om du vill visa minikalendern trycker du på nedåtpil eller Enter.",
	"components.input-date.revert": "{label} återgick till föregående värde.",
	"components.input-date.today": "Idag",
	"components.input-date.useDateFormat": "Använd datumformatet {format}.",
	"components.input-date-range.endDate": "Slutdatum",
	"components.input-date-range.errorBadInput": "{startLabel} måste vara före {endLabel}",
	"components.input-date-range.interactive-label": "Inmatning av datumintervall",
	"components.input-date-range.startDate": "Startdatum",
	"components.input-date-time.date": "Datum",
	"components.input-date-time.errorMaxDateOnly": "Datumet måste vara {maxDate} eller tidigare",
	"components.input-date-time.errorMinDateOnly": "Datumet måste vara {minDate} eller senare",
	"components.input-date-time.errorOutsideRange": "Datumet ska vara mellan {minDate} och {maxDate}",
	"components.input-date-time.time": "Tid",
	"components.input-date-time-range.endDate": "Slutdatum",
	"components.input-date-time-range.errorBadInput": "{startLabel} måste vara före {endLabel}",
	"components.input-date-time-range.interactive-label": "Inmatning av datum- och tidsintervall",
	"components.input-date-time-range.startDate": "Startdatum",
	"components.input-date-time-range-to.to": "till",
	"components.input-number.hintDecimalDuplicate": "Det finns redan en decimal i det här talet",
	"components.input-number.hintDecimalIncorrectComma": "Om du vill lägga till en decimal använder du kommatecknet ”,”",
	"components.input-number.hintDecimalIncorrectPeriod": "Om du vill lägga till en decimal använder du punkttecknet ”.”",
	"components.input-number.hintInteger": "I det här fältet accepteras endast heltalsvärden (inga decimaler)",
	"components.input-search.clear": "Rensa sökning",
	"components.input-search.defaultPlaceholder": "Sök ...",
	"components.input-search.search": "Sökning",
	"components.input-time-range.endTime": "Sluttid",
	"components.input-time-range.errorBadInput": "{startLabel} måste vara före {endLabel}",
	"components.input-time-range.startTime": "Starttid",
	"components.interactive.instructions": "Tryck på Enter för att interagera och Escape för att avsluta",
	"components.link.open-in-new-window": "Öppnas i ett nytt fönster.",
	"components.list.keyboard": "Använd <b>piltangenterna</b> för att flytta fokus i listan eller <b>Page Up/Down</b> för att gå fem upp eller ned",
	"components.list-controls.label": "Åtgärder för lista",
	"components.list-item.addItem": "Lägg till objekt",
	"components.list-item-drag-handle.default": "Åtgärd för att ändra ordning på objekt för {name}",
	"components.list-item-drag-handle.keyboard": "Flytta objekt. Aktuell position: {currentPosition} av {size}. Om du vill flytta det här objektet trycker du på uppåt- eller nedåtpilen.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Växla tangentbordets sorteringsläge.",
	"components.list-item-drag-handle-tooltip.enter-key": "Ange",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Ändra kapslingsnivån.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Vänster/höger",
	"components.list-item-drag-handle-tooltip.title": "Tangentbordskontroller för omsortering:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Flytta objekt uppåt eller nedåt i listan.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Upp/ned",
	"components.menu-item-return.return": "Återgå till föregående meny.",
	"components.menu-item-return.returnCurrentlyShowing": "Återgå till föregående meny. Du visar {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} av {y}",
	"components.meter-mixin.progressIndicator": "Förloppsindikator",
	"components.more-less.less": "mindre",
	"components.more-less.more": "mer",
	"components.object-property-list.item-placeholder-text": "Platshållarobjekt",
	"components.overflow-group.moreActions": "Fler åtgärder",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} objekt}
			other {{countFormatted} objekt}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} av {totalCountFormatted} objekt}
			other {{countFormatted} av {totalCountFormatted} objekt}
		}`,
	"components.pager-load-more.action": "Läs in fler",
	"components.pager-load-more.action-with-page-size": "Läs in {count} till",
	"components.pager-load-more.status-loading": "Läser in fler objekt",
	"components.selection.action-max-hint":
		`{count, plural,
			one {inaktiveras när fler än {countFormatted} objekt väljs}
			other {inaktiveras när fler än {countFormatted} objekt väljs}
		}`,
	"components.selection.action-required-hint": "Välj ett objekt för att utföra åtgärden",
	"components.selection.select-all": "Välj alla",
	"components.selection.select-all-items": "Välj alla {count} objekt",
	"components.selection.selected": "{count} valda",
	"components.selection.selected-plus": "Över {count} valda",
	"components.selection-controls.label": "Åtgärder för val",
	"components.sort.label": "Sortera",
	"components.sort.text": "Sortera: {selectedItemText}",
	"components.switch.conditions": "Villkoren måste uppfyllas",
	"components.switch.hidden": "Dold",
	"components.switch.visible": "Synlig",
	"components.switch.visibleWithPeriod": "Synlig.",
	"components.table-col-sort-button.addSortOrder": "Välj för att lägga till sorteringsordning",
	"components.table-col-sort-button.changeSortOrder": "Välj för att ändra sorteringsordning",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Sorterat från nytt till gammalt}
				other {Sorterat från gammalt till nytt}
			}}
			numbers {{direction, select,
				desc {Sorterat från högt till lågt}
				other {Sorterat från lågt till högt}
			}}
			words {{direction, select,
				desc {Sorterat från Ö till A}
				other {Sorterat från A till Ö}
			}}
			value {Sorterat {selectedMenuItemText}}
			other {{direction, select,
				desc {Sorterat i fallande ordning}
				other {Sorterat i stigande ordning}
			}}
		}`,
	"components.table-controls.label": "Åtgärder för tabell",
	"components.tabs.next": "Bläddra framåt",
	"components.tabs.previous": "Bläddra bakåt",
	"components.tag-list.clear": "Klicka, tryck på backstegstangenten eller Delete-tangenten för att ta bort objektet {value}",
	"components.tag-list.clear-all": "Rensa alla",
	"components.tag-list.cleared-all": "Ta bort alla tagglistobjekt",
	"components.tag-list.cleared-item": "Ta bort tagglistobjektet {value}",
	"components.tag-list.interactive-label": "Tagglista, {count} objekt",
	"components.tag-list.num-hidden": "+ {count} till",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Tagglista med 0 objekt}
			one {Tagglista med {count} objekt}
			other {Tagglista med {count} objekt}
		}`,
	"components.tag-list.show-less": "Visa färre",
	"components.tag-list.show-more-description": "Välj för att visa dolda tagglistobjekt",
	"components.tag-list-item.role-description": "Tagg",
	"components.tag-list-item.tooltip-arrow-keys": "Piltangenter",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Flytta mellan taggar",
	"components.tag-list-item.tooltip-delete-key": "Backstegstangenten/Delete-tangenten",
	"components.tag-list-item.tooltip-delete-key-desc": "Ta bort den fokuserade taggen",
	"components.tag-list-item.tooltip-title": "Tangentbordskontroller",
	"templates.primary-secondary.divider": "Avgränsare för sekundär panel",
	"templates.primary-secondary.secondary-panel": "Sekundär panel"
};
