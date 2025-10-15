export default {
	"components.alert.close": "Fermer l’alerte",
	"components.breadcrumbs.breadcrumb": "Chemin de navigation",
	"components.button-add.addItem": "Ajouter un élément",
	"components.button-copy.copied": "Copied",
	"components.button-split.otherOptions": "Autres options",
	"components.calendar.hasEvents": "Comprend des événements.",
	"components.calendar.notSelected": "Non sélectionné(e)",
	"components.calendar.selected": "Sélectionné(e).",
	"components.calendar.show": "Afficher {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Fermer cette boîte de dialogue",
	"components.dialog.critical": "Essentiel!",
	"components.dropdown.close": "Fermer",
	"components.filter.activeFilters": "Filtres actifs :",
	"components.filter.additionalContentTooltip": "Utilisez les <b>flèches orientées vers la gauche et vers la droite</b> pour déplacer la focalisation dans la liste d’éléments",
	"components.filter.clear": "Effacer",
	"components.filter.clearAll": "Effacer tout",
	"components.filter.clearAllAnnounce": "Effacement de tous les filtres en cours",
	"components.filter.clearAllAnnounceOverride": "Effacement en cours de tous les filtres pour : {filterText}",
	"components.filter.clearAllDescription": "Effacer tous les filtres",
	"components.filter.clearAllDescriptionOverride": "Effacer tous les filtres pour : {filterText}",
	"components.filter.clearAnnounce": "Effacement des filtres pour : {filterName} en cours",
	"components.filter.clearDescription": "Effacer les filtres pour : {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Aucun filtre appliqué.}
			one {{number} filtre appliqué.}
			other {{number} filtres appliqués.}
		}`,
	"components.filter.filters": "Filtres",
	"components.filter.loading": "Chargement des filtres",
	"components.filter.noFilters": "Aucun filtre disponible",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Aucun résultat de recherche}
			one {{number} résultat de recherche}
			other {{number} résultats de recherche}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Les filtres sélectionnés s’affichent en premier.",
	"components.filter.singleDimensionDescription": "Filtrer par : {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Aujourd’hui}
			one {{num} dernier jour}
			other {{num} derniers jours}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Dernière heure}
			other {{num} dernières heures}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "{num} derniers mois",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, développez la section pour choisir les dates",
	"components.filter-dimension-set-date-time-range-value.text": "Période personnalisée",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "De {startValue} à {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Avant {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Après {startValue}",
	"components.form-element.defaultError": "{label} n’est pas valide",
	"components.form-element.defaultFieldLabel": "Champ",
	"components.form-element.input.email.typeMismatch": "L’adresse courriel n’est pas valide",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Le nombre doit être supérieur à {min} et inférieur à {max}.}
				other {Le nombre doit être supérieur à {min} et inférieur ou égal à {max}.}
			}}
			other {{maxExclusive, select,
				true {Le nombre doit être supérieur ou égal à {min} et inférieur à {max}.}
				other {Le nombre doit être supérieur ou égal à {min} et inférieur ou égal à {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Le nombre doit être inférieur à {max}.}
			other {Le nombre doit être inférieur ou égal à {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Le nombre doit être supérieur à {min}.}
			other {Le nombre doit être supérieur ou égal à {min}.}
		}`,
	"components.form-element.input.text.tooShort": "{label} doit comprendre au moins {minlength} caractères",
	"components.form-element.input.url.typeMismatch": "L’URL n’est pas valide",
	"components.form-element.valueMissing": "{label} est requis",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Il y avait {count} erreur trouvée dans les informations que vous avez soumises}
			other {Il y avait {count} erreurs trouvées dans les informations que vous avez soumises}
		}`,
	"components.form-error-summary.text": "Afficher les détails de l’erreur",
	"components.input-color.backgroundColor": "Couleur d’arrière-plan",
	"components.input-color.foregroundColor": "Couleur de l’avant-plan",
	"components.input-color.none": "Aucun",
	"components.input-date.clear": "Effacer",
	"components.input-date.errorMaxDateOnly": "La date doit être {maxDate} ou une date antérieure",
	"components.input-date.errorMinDateOnly": "La date doit être {minDate} ou une date ultérieure",
	"components.input-date.errorOutsideRange": "La date doit être comprise entre {minDate} et {maxDate}",
	"components.input-date.now": "Maintenant",
	"components.input-date.openInstructions": "Utiliser le format de date {format}. Utiliser la flèche vers le bas ou la touche d’entrée pour accéder au mini-calendrier.",
	"components.input-date.revert": "La valeur précédente a été réattribuée à {label}.",
	"components.input-date.today": "Aujourd’hui",
	"components.input-date.useDateFormat": "Utiliser le format de date {format}.",
	"components.input-date-range.endDate": "Date de fin",
	"components.input-date-range.errorBadInput": "{startLabel} doit précéder {endLabel}",
	"components.input-date-range.interactive-label": "Plage de dates saisie",
	"components.input-date-range.startDate": "Date du début",
	"components.input-date-time.date": "Date",
	"components.input-date-time.errorMaxDateOnly": "La date doit être {maxDate} ou une date antérieure",
	"components.input-date-time.errorMinDateOnly": "La date doit être {minDate} ou une date ultérieure",
	"components.input-date-time.errorOutsideRange": "La date doit être comprise entre {minDate} et {maxDate}",
	"components.input-date-time.time": "Heure",
	"components.input-date-time-range.endDate": "Date de fin",
	"components.input-date-time-range.errorBadInput": "{startLabel} doit précéder {endLabel}",
	"components.input-date-time-range.interactive-label": "Dates et heures saisies",
	"components.input-date-time-range.startDate": "Date du début",
	"components.input-date-time-range-to.to": "à",
	"components.input-number.hintDecimalDuplicate": "Ce nombre comporte déjà une décimale",
	"components.input-number.hintDecimalIncorrectComma": "Pour ajouter une décimale, utilisez la virgule « , »",
	"components.input-number.hintDecimalIncorrectPeriod": "Pour ajouter une décimale, utilisez le point « . »",
	"components.input-number.hintInteger": "Ce champ accepte uniquement les valeurs entières (sans décimales)",
	"components.input-search.clear": "Effacer la recherche",
	"components.input-search.defaultPlaceholder": "Rechercher…",
	"components.input-search.search": "Rechercher",
	"components.input-time-range.endTime": "Heure de fin",
	"components.input-time-range.errorBadInput": "{startLabel} doit précéder {endLabel}",
	"components.input-time-range.startTime": "Heure de début",
	"components.interactive.instructions": "Appuyez sur Entrée pour interagir, sur Échapper pour quitter",
	"components.link.open-in-new-window": "Ouvre une nouvelle fenêtre.",
	"components.list.keyboard": "Utiliser les <b>touches fléchées</b> pour parcourir cette liste ou les touches <b>page up/down</b> pour monter ou descendre 5 éléments à la fois.",
	"components.list-controls.label": "Actions pour la liste",
	"components.list-item.addItem": "Ajouter un élément",
	"components.list-item-drag-handle.default": "Réordonner l’action de l’élément pour {name}",
	"components.list-item-drag-handle.keyboard": "Réorganiser les éléments, position actuelle {currentPosition} de {size}. Pour déplacer cet élément, utilisez les flèches vers le haut et vers le bas.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Basculer en mode réorganiser le clavier.",
	"components.list-item-drag-handle-tooltip.enter-key": "Entrée",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Changer le niveau d’imbrication.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Gauche/droite",
	"components.list-item-drag-handle-tooltip.title": "Commandes du clavier pour la réorganisation :",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Déplacer l’élément vers le haut ou vers le bas dans la liste.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Haut/bas",
	"components.menu-item-return.return": "Retour au menu précédent.",
	"components.menu-item-return.returnCurrentlyShowing": "Retour au menu précédent. Vous voyez actuellement {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} sur {y}",
	"components.meter-mixin.progressIndicator": "Indicateur de progrès",
	"components.more-less.less": "moins",
	"components.more-less.more": "plus",
	"components.object-property-list.item-placeholder-text": "Élément de paramètre fictif",
	"components.overflow-group.moreActions": "Plus d’actions",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} élément}
			other {{countFormatted} éléments}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} de {totalCountFormatted} élément}
			other {{countFormatted} de {totalCountFormatted} éléments}
		}`,
	"components.pager-load-more.action": "En télécharger plus",
	"components.pager-load-more.action-with-page-size": "Charger {count} de plus",
	"components.pager-load-more.status-loading": "Chargement d’autres d’éléments",
	"components.scroll-wrapper.scroll-left": "Défilement de l’écran vers la gauche",
	"components.scroll-wrapper.scroll-right": "Défilement de l’écran vers la droite",
	"components.selection.action-max-hint":
		`{count, plural,
			one {Désactivé lorsque plus de {countFormatted} élément est sélectionné}
			other {Désactivé lorsque plus de {countFormatted} éléments sont sélectionnés}
		}`,
	"components.selection.action-required-hint": "Sélectionnez un élément pour exécuter cette action",
	"components.selection.select-all": "Tout sélectionner",
	"components.selection.select-all-items":
		`{count, plural,
			=1 {Select Item}
			one {Select All {countFormatted} Item}
			other {Sélectionner tous les {countFormatted} éléments}
		}`,
	"components.selection.selected": "{count} sélectionné(s)",
	"components.selection.selected-plus": "{count}+ sélectionné",
	"components.selection-controls.label": "Actions à sélectionner",
	"components.sort.label": "Trier",
	"components.sort.text": "Trier : {selectedItemText}",
	"components.switch.conditions": "Les conditions doivent être remplies",
	"components.switch.hidden": "Masqué",
	"components.switch.visible": "Visible",
	"components.switch.visibleWithPeriod": "Visible.",
	"components.table-col-sort-button.addSortOrder": "Sélectionner pour ajouter un ordre de tri",
	"components.table-col-sort-button.changeSortOrder": "Sélectionner pour modifier l’ordre de tri",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Trié du plus récent au plus ancien}
				other {Trié du plus ancien au plus récent}
			}}
			numbers {{direction, select,
				desc {Trié du plus élevé au moins élevé}
				other {Trié du moins élevé au plus élevé}
			}}
			words {{direction, select,
				desc {Trié de Z à A}
				other {Trié de A à Z}
			}}
			value {Trié {selectedMenuItemText}}
			other {{direction, select,
				desc {Trié en ordre décroissant}
				other {Trié en ordre croissant}
			}}
		}`,
	"components.table-controls.label": "Actions pour la table",
	"components.tabs.next": "Défilement avant",
	"components.tabs.previous": "Défilement arrière",
	"components.tag-list.clear": "Cliquez sur le bouton, appuyez sur retour arrière ou appuyez sur la touche de suppression pour supprimer l’élément {value}",
	"components.tag-list.clear-all": "Effacer tout",
	"components.tag-list.cleared-all": "Suppression de tous les éléments de la liste des balises",
	"components.tag-list.cleared-item": "Élément {value} de la liste des balises supprimé",
	"components.tag-list.interactive-label": "Liste des balises, {count} éléments",
	"components.tag-list.num-hidden": "+ {count} de plus",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Liste de balises avec 0 élément}
			one {Liste de balises avec {count} élément}
			other {Liste de balises avec {count} éléments}
		}`,
	"components.tag-list.show-less": "Afficher moins",
	"components.tag-list.show-more-description": "Sélectionnez cette option pour afficher les éléments de la liste des balises cachées",
	"components.tag-list-item.role-description": "Marquer",
	"components.tag-list-item.tooltip-arrow-keys": "Touches fléchées",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Passer d’une balise à l’autre",
	"components.tag-list-item.tooltip-delete-key": "Retour arrière/suppression",
	"components.tag-list-item.tooltip-delete-key-desc": "Supprimer la balise ciblée",
	"components.tag-list-item.tooltip-title": "Commandes du clavier",
	"templates.primary-secondary.divider": "Séparateur de panneau secondaire",
	"templates.primary-secondary.secondary-panel": "Panneau secondaire"
};
