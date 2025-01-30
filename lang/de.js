export default {
	"components.alert.close": "Benachrichtigung schließen",
	"components.breadcrumbs.breadcrumb": "Brotkrümelnavigation",
	"components.button-add.addItem": "Element hinzufügen",
	"components.calendar.hasEvents": "Hat Ereignisse.",
	"components.calendar.notSelected": "Nicht ausgewählt.",
	"components.calendar.selected": "Ausgewählt.",
	"components.calendar.show": "{month} anzeigen",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Dieses Dialogfeld schließen",
	"components.dialog.critical": "Kritisch!",
	"components.dropdown.close": "Schließen",
	"components.filter.activeFilters": "Aktive Filter:",
	"components.filter.additionalContentTooltip": "Verwenden Sie die <b>Pfeiltasten links/rechts</b>, um den Fokus innerhalb dieses Listenelements zu bewegen",
	"components.filter.clear": "Löschen",
	"components.filter.clearAll": "Alle löschen",
	"components.filter.clearAllAnnounce": "Alle Filter werden gelöscht",
	"components.filter.clearAllAnnounceOverride": "Alle Filter für {filterText} werden gelöscht",
	"components.filter.clearAllDescription": "Alle Filter löschen",
	"components.filter.clearAllDescriptionOverride": "Alle Filter für {filterText} löschen",
	"components.filter.clearAnnounce": "Filter für {filterName} werden gelöscht",
	"components.filter.clearDescription": "Filter für {filterName} löschen",
	"components.filter.loading": "Filter werden geladen",
	"components.filter.filterCountDescription":
	`{number, plural,
		=0 {Keine Filter angewendet.}
		one {{number} Filter angewendet.}
		other {{number} Filter angewendet.}
	}`,
	"components.filter.filters": "Filter",
	"components.filter.noFilters": "Keine verfügbaren Filter",
	"components.filter.searchResults":
	`{number, plural,
		=0 {Kein Suchergebnis}
		one {{number} Suchergebnis}
		other {{number} Suchergebnisse}
	}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Ausgewählte Filter werden zuerst angezeigt.",
	"components.filter.singleDimensionDescription": "Filtern nach: {filterName}",
	"components.filter-dimension-set-date-text-value.textHours":
	`{num, plural,
		=1 {Letzte Stunde}
		other {Letzte {num} Stunden}
	}`,
	"components.filter-dimension-set-date-text-value.textDays":
	`{num, plural,
		=0 {Heute}
		one {Letzter Tag}
		other {Letzte {num} Tage}
	}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Letzte {num} Monate",
	"components.filter-dimension-set-date-time-range-value.label": "{text} – erweitern, um Daten auszuwählen",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} nach {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Nach {startValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Vor {endValue}",
	"components.filter-dimension-set-date-time-range-value.text": "Benutzerdefinierter Datumsbereich",
	"components.form-element.defaultError": "{label} ist ungültig",
	"components.form-element.defaultFieldLabel": "Feld",
	"components.form-element.input.email.typeMismatch": "Die E-Mail-Adresse ist ungültig",
	"components.form-element.input.number.rangeError":
	`{minExclusive, select,
		true {{maxExclusive, select,
			true {Zahl muss größer als {min} und kleiner als {max} sein.}
			other {Zahl muss größer als {min} und kleiner als oder gleich {max} sein.}
		}}
		other {{maxExclusive, select,
			true {Zahl muss größer als oder gleich {min} und kleiner als {max} sein.}
			other {Zahl muss größer als oder gleich {min} und kleiner als oder gleich {max} sein.}
		}}
	}`,
	"components.form-element.input.number.rangeOverflow":
	`{maxExclusive, select,
		true {Zahl muss kleiner als {max} sein.}
		other {Zahl muss kleiner als oder gleich {max} sein.}
	}`,
	"components.form-element.input.number.rangeUnderflow":
	`{minExclusive, select,
		true {Zahl muss größer als {min} sein.}
		other {Zahl muss größer als oder gleich {min} sein.}
	}`,
	"components.form-element.input.text.tooShort": "{label} muss mindestens {minlength} Zeichen enthalten",
	"components.form-element.input.url.typeMismatch": "URL ist ungültig",
	"components.form-element.valueMissing": "{label} ist erforderlich",
	"components.form-error-summary.errorSummary":
	`{count, plural,
		one {Die von Ihnen übermittelten Informationen enthalten {count} Fehler}
		other {Die von Ihnen übermittelten Informationen enthalten {count} Fehler}
	}`,
	"components.form-error-summary.text": "Fehlerdetails ein-/ausschalten",
	"components.input-color.backgroundColor": "Hintergrundfarbe",
	"components.input-color.foregroundColor": "Vordergrundfarbe",
	"components.input-color.none": "Keine",
	"components.input-date-range.endDate": "Enddatum",
	"components.input-date-range.errorBadInput": "{startLabel} muss vor {endLabel} liegen",
	"components.input-date-range.interactive-label": "Datumsbereich eingeben",
	"components.input-date-range.startDate": "Startdatum",
	"components.input-date-time-range-to.to": "bis",
	"components.input-date-time-range.endDate": "Enddatum",
	"components.input-date-time-range.errorBadInput": "{startLabel} muss vor {endLabel} liegen",
	"components.input-date-time-range.startDate": "Startdatum",
	"components.input-date-time.date": "Datum",
	"components.input-date-time.errorMaxDateOnly": "Das Datum muss am oder vor dem {maxDate} liegen",
	"components.input-date-time.errorMinDateOnly": "Das Datum muss am oder nach dem {minDate} liegen",
	"components.input-date-time.errorOutsideRange": "Datum muss zwischen {minDate} und {maxDate} liegen",
	"components.input-date-time.time": "Uhrzeit",
	"components.input-date-time-range.interactive-label": "Datums- und Zeitbereich eingeben",
	"components.input-date.clear": "Löschen",
	"components.input-date.errorMaxDateOnly": "Das Datum muss am oder vor dem {maxDate} liegen",
	"components.input-date.errorMinDateOnly": "Das Datum muss am oder nach dem {minDate} liegen",
	"components.input-date.errorOutsideRange": "Datum muss zwischen {minDate} und {maxDate} liegen",
	"components.input-date.openInstructions": "Das Datumsformat {format} verwenden. Minikalender durch Abwärtspfeil oder durch Drücken der Eingabetaste aufrufen.",
	"components.input-date.now": "Jetzt",
	"components.input-date.revert": "{label} auf vorherigen Wert zurückgesetzt.",
	"components.input-date.today": "Heute",
	"components.input-date.useDateFormat": "Das Datumsformat {format} verwenden.",
	"components.input-number.hintInteger": "Dieses Feld akzeptiert nur Ganzzahlen (keine Dezimalstellen)",
	"components.input-number.hintDecimalDuplicate": "Diese Zahl enthält bereits eine Dezimale",
	"components.input-number.hintDecimalIncorrectComma": "Verwenden Sie zum Hinzufügen einer Dezimalstelle das Komma „,“",
	"components.input-number.hintDecimalIncorrectPeriod": "Verwenden Sie zum Hinzufügen einer Dezimalstelle das Zeichen „.“",
	"components.input-search.clear": "Suche löschen",
	"components.input-search.defaultPlaceholder": "Suchen...",
	"components.input-search.search": "Suchen",
	"components.input-time-range.endTime": "Endzeit",
	"components.input-time-range.errorBadInput": "{startLabel} muss vor {endLabel} liegen",
	"components.input-time-range.startTime": "Startzeit",
	"components.interactive.instructions": "Drücken Sie die Eingabetaste zum Interagieren oder die Escape-Taste, um das Fenster zu schließen",
	"components.link.open-in-new-window": "Wird in einem neuen Fenster geöffnet.",
	"components.list.keyboard": "Verwenden Sie die <b>Pfeiltasten</b>, um den Fokus innerhalb dieser Liste zu verschieben, oder die Tasten <b>Bild hoch/Bild runter</b>, um ihn um 5 Zeilen hinauf oder hinunter zu verschieben",
	"components.list-controls.label": "Aktionen für Liste",
	"components.list-item.addItem": "Element hinzufügen",
	"components.list-item-drag-handle.default": "Elementaktion für {name} neu anordnen",
	"components.list-item-drag-handle.keyboard": "Elemente neu anordnen; aktuelle Position: {currentPosition} von {size}. Drücken Sie zum Bewegen dieses Elements auf den Pfeil nach oben oder den Pfeil nach unten.",
	"components.list-item-drag-handle-tooltip.title": "Tastatursteuerelemente für Neuanordnung:",
	"components.list-item-drag-handle-tooltip.enter-key": "Eingabe",
	"components.list-item-drag-handle-tooltip.enter-desc": "Tastatur-Neuanordnungsmodus ändern.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Nach oben/unten",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Element in der Liste nach oben oder unten verschieben.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Links/Rechts",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Verschachtelungsebene ändern.",
	"components.menu-item-return.return": "Zum vorherigen Menü zurückkehren.",
	"components.menu-item-return.returnCurrentlyShowing": "Zum vorherigen Menü zurückkehren. Sie betrachten gerade {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} von {y}",
	"components.meter-mixin.progressIndicator": "Fortschrittsanzeige",
	"components.more-less.less": "Weniger",
	"components.more-less.more": "mehr",
	"components.object-property-list.item-placeholder-text": "Platzhalterelement",
	"components.overflow-group.moreActions": "Weitere Aktionen",
	"components.pager-load-more.action": "Mehr laden",
	"components.pager-load-more.action-with-page-size": "{count} weitere laden",
	"components.pageable.info":
	`{count, plural,
		one {{countFormatted} Element}
		other {{countFormatted} Elemente}
	}`,
	"components.pageable.info-with-total":
	`{totalCount, plural,
		one {{countFormatted} von {totalCountFormatted} Element}
		other {{countFormatted} von {totalCountFormatted} Elemente}
	}`,
	"components.pager-load-more.status-loading": "Weitere Elemente werden geladen",
	"components.selection.action-max-hint":
	`{count, plural,
		one {Deaktiviert, wenn mehr als {countFormatted} Element ausgewählt ist}
		other {Deaktiviert, wenn mehr als {countFormatted} Elemente ausgewählt sind}
	}`,
	"components.selection.action-required-hint": "Wählen Sie ein Element aus, um diese Aktion auszuführen",
	"components.selection.select-all": "Alle auswählen",
	"components.selection.select-all-items": "Alle {count} Elemente auswählen",
	"components.selection.selected": "{count} ausgewählt",
	"components.selection.selected-plus": "{count}+ ausgewählt",
	"components.selection-controls.label": "Aktionen für Auswahl",
	"components.switch.visible": "Sichtbar",
	"components.switch.visibleWithPeriod": "Sichtbar.",
	"components.switch.hidden": "Ausgeblendet",
	"components.switch.conditions": "Bedingungen müssen erfüllt sein",
	"components.table-col-sort-button.addSortOrder": "Wählen Sie diese Option, um eine Sortierreihenfolge hinzuzufügen",
	"components.table-col-sort-button.changeSortOrder": "Wählen Sie diese Option, um die Sortierreihenfolge zu ändern",
	"components.table-col-sort-button.title":
	`{sourceType, select,
		dates {{direction, select,
			desc {Von neu nach alt sortiert}
			other {Von alt nach neu sortiert}
		}}
		numbers {{direction, select,
			desc {Von hoch nach niedrig sortiert}
			other {Von niedrig nach hoch sortiert}
		}}
		words {{direction, select,
			desc {Von Z nach A sortiert}
			other {Von A nach Z sortiert}
		}}
		value {Sortiert {selectedMenuItemText}}
		other {{direction, select,
			desc {Absteigend sortiert}
			other {Aufsteigend sortiert}
		}}
	}`,
	"components.table-controls.label": "Aktionen für Tabelle",
	"components.tabs.next": "Weiterblättern",
	"components.tabs.previous": "Zurückblättern",
	"components.tag-list.clear": "Klicken Sie, drücken Sie die Rücktaste, oder drücken Sie die Entfernen-Taste, um das Element {value} zu entfernen",
	"components.tag-list.clear-all": "Alle löschen",
	"components.tag-list.cleared-all": "Alle Elemente der Tag-Liste wurden entfernt",
	"components.tag-list.cleared-item": "Element {value} der Tag-Liste wurde entfernt",
	"components.tag-list.interactive-label": "Tag-Liste, {count} Elemente",
	"components.tag-list.num-hidden": "+ {count} weitere",
	"components.tag-list.role-description": "Tag-Liste",
	"components.tag-list.show-less": "Weniger anzeigen",
	"components.tag-list.show-more-description": "Wählen Sie diese Option, um ausgeblendete Elemente der Tag-Liste anzuzeigen",
	"components.tag-list-item.role-description": "Tag",
	"components.tag-list-item.tooltip-arrow-keys": "Pfeiltasten",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Zwischen Tags wechseln",
	"components.tag-list-item.tooltip-delete-key": "Rücktaste/Entfernen",
	"components.tag-list-item.tooltip-delete-key-desc": "Ausgewählten Tag löschen",
	"components.tag-list-item.tooltip-title": "Tastatursteuerung",
	"templates.primary-secondary.divider": "Sekundäre Bereichstrennung",
	"templates.primary-secondary.secondary-panel": "Sekundärer Bereich"
};
