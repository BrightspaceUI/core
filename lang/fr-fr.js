export default {
	"components.alert.close": "Fermer l’alerte",
	"components.breadcrumbs.breadcrumb": "Chemin de navigation",
	"components.button-add.addItem": "Ajouter un élément",
	"components.button-split.otherOptions": "Autres options",
	"components.calendar.hasEvents": "A des événements.",
	"components.calendar.notSelected": "Non sélectionné.",
	"components.calendar.selected": "Sélectionné.",
	"components.calendar.show": "Afficher {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Fermer cette boîte de dialogue",
	"components.dialog.critical": "Critique !",
	"components.dropdown.close": "Fermer",
	"components.filter.activeFilters": "Filtres actifs :",
	"components.filter.additionalContentTooltip": "Utilisez les <b>touches fléchées gauche/droite</b> pour vous concentrer sur cet élément de la liste",
	"components.filter.clear": "Effacer",
	"components.filter.clearAll": "Tout effacer",
	"components.filter.clearAllAnnounce": "Suppression de tous les filtres",
	"components.filter.clearAllAnnounceOverride": "Suppression de tous les filtres pour : {filterText}",
	"components.filter.clearAllDescription": "Supprimer tous les filtres",
	"components.filter.clearAllDescriptionOverride": "Effacer tous les filtres pour : {filterText}",
	"components.filter.clearAnnounce": "Suppression des filtres pour : {filterName}",
	"components.filter.clearDescription": "Supprimer les filtres pour : {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Aucun filtre appliqué.}
			one {{number} filtre appliqué.}
			other {{number} filtres appliqués.}
		}`,
	"components.filter.filters": "Filtres",
	"components.filter.loading": "Chargement des filtres",
	"components.filter.noFilters": "Aucun filtre disponible",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Aucun résultat de recherche}
			one {{number} résultat de recherche}
			other {{number} résultats de recherche}
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
	"components.filter-dimension-set-date-time-range-value.label": "{text}, développez pour choisir des dates",
	"components.filter-dimension-set-date-time-range-value.text": "Période personnalisée",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "De {startValue} à {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Avant {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Après {startValue}",
	"components.form-element.defaultError": "{label} n’est pas valide",
	"components.form-element.defaultFieldLabel": "Champ",
	"components.form-element.input.email.typeMismatch": "L’adresse e-mail n’est pas valide.",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Le nombre doit être supérieur à {min} et inférieur à {max}.}
				other {Le nombre doit être supérieur à {min} et inférieur à ou égal à {max}.}
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
	"components.form-element.input.text.tooShort": "{label} doit contenir au moins {minlength} caractères.",
	"components.form-element.input.url.typeMismatch": "URL non valide",
	"components.form-element.valueMissing": "{label} est obligatoire",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {{count} erreur trouvée dans les informations soumises}
			other {{count} erreurs trouvées dans les informations soumises}
		}`,
	"components.form-error-summary.text": "Afficher/Masquer les détails de l’erreur",
	"components.input-color.backgroundColor": "Couleur de l’arrière-plan",
	"components.input-color.foregroundColor": "Couleur de l’avant-plan",
	"components.input-color.none": "Aucune",
	"components.input-date.clear": "Effacer",
	"components.input-date.errorMaxDateOnly": "La date doit être antérieure ou égale au {maxDate}",
	"components.input-date.errorMinDateOnly": "La date doit être égale ou postérieure au {minDate}",
	"components.input-date.errorOutsideRange": "La date doit être comprise entre {minDate} et {maxDate}",
	"components.input-date.now": "Maintenant",
	"components.input-date.openInstructions": "Utiliser le format de date {format}. Utilisez la flèche vers le bas ou appuyez sur Entrée pour accéder au mini-calendrier.",
	"components.input-date.revert": "{label} a rétabli la valeur précédente.",
	"components.input-date.today": "Aujourd’hui",
	"components.input-date.useDateFormat": "Utiliser le format de date {format}.",
	"components.input-date-range.endDate": "Date de fin",
	"components.input-date-range.errorBadInput": "{startLabel} doit être antérieur à {endLabel}",
	"components.input-date-range.interactive-label": "Entrée de la plage de dates",
	"components.input-date-range.startDate": "Date de début",
	"components.input-date-time.date": "Date",
	"components.input-date-time.errorMaxDateOnly": "La date doit être antérieure ou égale au {maxDate}",
	"components.input-date-time.errorMinDateOnly": "La date doit être égale ou postérieure au {minDate}",
	"components.input-date-time.errorOutsideRange": "La date doit être comprise entre {minDate} et {maxDate}",
	"components.input-date-time.time": "Heure",
	"components.input-date-time-range.endDate": "Date de fin",
	"components.input-date-time-range.errorBadInput": "{startLabel} doit être antérieur à {endLabel}",
	"components.input-date-time-range.interactive-label": "Entrée de la plage de date et de la période",
	"components.input-date-time-range.startDate": "Date de début",
	"components.input-date-time-range-to.to": "à",
	"components.input-number.hintDecimalDuplicate": "Il existe déjà une décimale dans ce nombre",
	"components.input-number.hintDecimalIncorrectComma": "Pour ajouter une décimale, utilisez la virgule « , »",
	"components.input-number.hintDecimalIncorrectPeriod": "Pour ajouter une décimale, utilisez le point « . »",
	"components.input-number.hintInteger": "Ce champ accepte uniquement les valeurs entières (pas de décimales)",
	"components.input-search.clear": "Effacer la recherche",
	"components.input-search.defaultPlaceholder": "Rechercher...",
	"components.input-search.search": "Rechercher",
	"components.input-time-range.endTime": "Heure de fin",
	"components.input-time-range.errorBadInput": "{startLabel} doit être antérieur à {endLabel}",
	"components.input-time-range.startTime": "Heure de début",
	"components.interactive.instructions": "Appuyer sur entrée pour interagir, sur Echap pour quitter",
	"components.link.open-in-new-window": "S’ouvre dans une nouvelle fenêtre.",
	"components.list.keyboard": "Utilisez les <b>touches fléchées</b> pour vous concentrer sur cette liste, ou <b>faites défiler la page vers le haut/bas</b> pour la faire défiler de 5",
	"components.list-controls.label": "Actions pour la liste",
	"components.list-item.addItem": "Ajouter un élément",
	"components.list-item-drag-handle.default": "Action de réorganisation de l’élément pour {name}",
	"components.list-item-drag-handle.keyboard": "Réordonner les éléments, position actuelle {currentPosition} sur {size}. Pour déplacer cet élément, appuyez sur les flèches vers le haut ou vers le bas.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Basculez le mode de réorganisation du clavier.",
	"components.list-item-drag-handle-tooltip.enter-key": "Saisir",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Modifiez le niveau d’imbrication.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Gauche/droite",
	"components.list-item-drag-handle-tooltip.title": "Commandes du clavier pour la réorganisation :",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Déplacez l’élément vers le haut ou vers le bas dans la liste.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Haut/bas",
	"components.menu-item-return.return": "Revenir au menu précédent.",
	"components.menu-item-return.returnCurrentlyShowing": "Revenir au menu précédent. Vous consultez {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} sur {y}",
	"components.meter-mixin.progressIndicator": "Indicateur de progrès",
	"components.more-less.less": "moins",
	"components.more-less.more": "plus",
	"components.object-property-list.item-placeholder-text": "Élément d’espace réservé",
	"components.overflow-group.moreActions": "Plus d’actions",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} élément}
			other {{countFormatted} éléments}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} sur {totalCountFormatted} élément}
			other {{countFormatted} sur {totalCountFormatted} éléments}
		}`,
	"components.pager-load-more.action": "Charger plus",
	"components.pager-load-more.action-with-page-size": "Charger {count} supplémentaire(s)",
	"components.pager-load-more.status-loading": "Charger plus d’éléments",
	"components.selection.action-max-hint":
		`{count, plural,
			one {désactivé lorsque plus de {countFormatted} élément est sélectionné}
			other {désactivé lorsque plus de {countFormatted} éléments sont sélectionnés}
		}`,
	"components.selection.action-required-hint": "Sélectionnez un élément pour exécuter cette action",
	"components.selection.select-all": "Tout sélectionner",
	"components.selection.select-all-items": "Sélectionner tous les {count} éléments",
	"components.selection.selected": "{count} sélectionnés",
	"components.selection.selected-plus": "{count}+ sélectionné(e)(s)",
	"components.selection-controls.label": "Actions pour la sélection",
	"components.sort.label": "Trier",
	"components.sort.text": "Trier : {selectedItemText}",
	"components.switch.conditions": "Les conditions doivent être remplies",
	"components.switch.hidden": "Masqué",
	"components.switch.visible": "Visible",
	"components.switch.visibleWithPeriod": "Visible.",
	"components.table-col-sort-button.addSortOrder": "Sélectionnez pour ajouter un ordre de tri",
	"components.table-col-sort-button.changeSortOrder": "Sélectionner pour modifier l’ordre de tri",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Tri du plus récent au plus ancien}
				other {Tri du plus ancien au plus récent}
			}}
			numbers {{direction, select,
				desc {Tri du plus petit au plus grand}
				other {Tri du plus grand au plus petit}
			}}
			words {{direction, select,
				desc {Tri de Z à A}
				other {Tri de A à Z}
			}}
			value {Tri par {selectedMenuItemText}}
			other {{direction, select,
				desc {Tri par ordre décroissant}
				other {Tri par ordre croissant}
			}}
		}`,
	"components.table-controls.label": "Actions du tableau",
	"components.tabs.next": "Faire défiler vers l’avant",
	"components.tabs.previous": "Faire défiler vers l’arrière",
	"components.tag-list.clear": "Cliquez sur l’élément, appuyez sur la touche Retour arrière ou sur la touche Suppr pour supprimer l’élément {value}",
	"components.tag-list.clear-all": "Tout effacer",
	"components.tag-list.cleared-all": "Suppression de tous les éléments de la liste d’étiquettes",
	"components.tag-list.cleared-item": "Suppression de l’élément de liste d’étiquettes {value}",
	"components.tag-list.interactive-label": "Liste d’étiquettes, {count} éléments",
	"components.tag-list.num-hidden": "{count} de plus",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Liste d’étiquettes comportant 0 élément}
			one {Liste d’étiquettes comportant {count} élément}
			other {Liste d’étiquettes comportant {count} éléments}
		}`,
	"components.tag-list.show-less": "Afficher moins",
	"components.tag-list.show-more-description": "Sélectionnez cette option pour afficher les éléments de la liste d’étiquettes masquées",
	"components.tag-list-item.role-description": "Étiquette",
	"components.tag-list-item.tooltip-arrow-keys": "Touches fléchées",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Passez d’une étiquette à l’autre",
	"components.tag-list-item.tooltip-delete-key": "Retour arrière/Supprimer",
	"components.tag-list-item.tooltip-delete-key-desc": "Supprimez l’étiquette ciblée",
	"components.tag-list-item.tooltip-title": "Commandes du clavier",
	"templates.primary-secondary.divider": "Séparateur de panneau secondaire",
	"templates.primary-secondary.secondary-panel": "Panneau secondaire"
};
