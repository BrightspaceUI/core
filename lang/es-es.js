export default {
	"components.alert.close": "Cerrar alerta",
	"components.breadcrumbs.breadcrumb": "Ruta de navegación",
	"components.button-add.addItem": "Agregar elemento",
	"components.button-split.otherOptions": "Otras opciones",
	"components.calendar.hasEvents": "Tiene eventos.",
	"components.calendar.notSelected": "No seleccionado.",
	"components.calendar.selected": "Seleccionado.",
	"components.calendar.show": "Mostrar {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Cerrar este cuadro de diálogo",
	"components.dialog.critical": "¡Crítico!",
	"components.dropdown.close": "Cerrar",
	"components.filter.activeFilters": "Filtros activos:",
	"components.filter.additionalContentTooltip": "Utilice las <b>teclas de flecha izquierda/derecha</b> para mover el enfoque dentro de este elemento de la lista",
	"components.filter.clear": "Borrar",
	"components.filter.clearAll": "Borrar todo",
	"components.filter.clearAllAnnounce": "Borrando todos los filtros",
	"components.filter.clearAllAnnounceOverride": "Borrando todos los filtros de: {filterText}",
	"components.filter.clearAllDescription": "Borrar todos los filtros",
	"components.filter.clearAllDescriptionOverride": "Borrar todos los filtros de: {filterText}",
	"components.filter.clearAnnounce": "Borrando filtros para: {filterName}",
	"components.filter.clearDescription": "Borrar filtros para: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Sin filtros aplicados.}
			one {{number} filtro aplicado.}
			other {{number} filtros aplicados.}
		}`,
	"components.filter.filters": "Filtros",
	"components.filter.loading": "Cargando filtros",
	"components.filter.noFilters": "No hay filtros disponibles",
	"components.filter.searchResults":
		`{number, plural,
			=0 {No hay resultados de búsqueda}
			one {{number} resultado de búsqueda}
			other {{number} resultados de búsqueda}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Los filtros seleccionados aparecen primero.",
	"components.filter.singleDimensionDescription": "Filtrar por: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Hoy}
			one {Último día}
			other {Últimos {num} días}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Última hora}
			other {Últimas {num} horas}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Últimos {num} meses",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, amplíe para elegir fechas",
	"components.filter-dimension-set-date-time-range-value.text": "Intervalo de fechas personalizado",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} a {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Antes de {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Después de {startValue}",
	"components.form-element.defaultError": "{label} no es válido",
	"components.form-element.defaultFieldLabel": "Campo",
	"components.form-element.input.email.typeMismatch": "El correo electrónico no es válido",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {El número debe ser mayor que {min} y menor que {max}.}
				other {El número debe ser mayor que {min} y menor o igual que {max}.}
			}}
			other {{maxExclusive, select,
				true {El número debe ser mayor o igual que {min} y menor que {max}.}
				other {El número debe ser mayor o igual que {min} y menor o igual que {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {El número debe ser menor que {max}.}
			other {El número debe ser menor o igual que {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {El número debe ser mayor que {min}.}
			other {El número debe ser mayor o igual que {min}.}
		}`,
	"components.form-element.input.text.tooShort": "{label} debe tener al menos {minlength} caracteres",
	"components.form-element.input.url.typeMismatch": "La dirección URL no es válida",
	"components.form-element.valueMissing": "{label} es obligatorio",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Se ha encontrado {count} error en la información que ha enviado}
			other {Se han encontrado {count} errores en la información que ha enviado}
		}`,
	"components.form-error-summary.text": "Alternar detalles del error",
	"components.input-color.backgroundColor": "Color de fondo",
	"components.input-color.foregroundColor": "Color del primer plano",
	"components.input-color.none": "Ninguno",
	"components.input-date.clear": "Borrar",
	"components.input-date.errorMaxDateOnly": "La fecha debe ser {maxDate} o anterior",
	"components.input-date.errorMinDateOnly": "La fecha debe ser {minDate} o posterior",
	"components.input-date.errorOutsideRange": "La fecha debe estar entre el {minDate} y el {maxDate}",
	"components.input-date.now": "Ahora",
	"components.input-date.openInstructions": "Usar formato de fecha {format}. Use la fecha hacia abajo o pulse Intro para acceder al minicalendario.",
	"components.input-date.revert": "{label} ha vuelto al valor anterior.",
	"components.input-date.today": "Hoy",
	"components.input-date.useDateFormat": "Usar formato de fecha {format}.",
	"components.input-date-range.endDate": "Fecha final",
	"components.input-date-range.errorBadInput": "{startLabel} debe ser anterior a {endLabel}",
	"components.input-date-range.interactive-label": "Entrada de intervalo de fechas",
	"components.input-date-range.startDate": "Fecha de inicio",
	"components.input-date-time.date": "Fecha",
	"components.input-date-time.errorMaxDateOnly": "La fecha debe ser {maxDate} o anterior",
	"components.input-date-time.errorMinDateOnly": "La fecha debe ser {minDate} o posterior",
	"components.input-date-time.errorOutsideRange": "La fecha debe estar entre el {minDate} y el {maxDate}",
	"components.input-date-time.time": "Tiempo",
	"components.input-date-time-range.endDate": "Fecha final",
	"components.input-date-time-range.errorBadInput": "{startLabel} debe ser anterior a {endLabel}",
	"components.input-date-time-range.interactive-label": "Entrada de intervalo de fecha y hora",
	"components.input-date-time-range.startDate": "Fecha de inicio",
	"components.input-date-time-range-to.to": "para",
	"components.input-number.hintDecimalDuplicate": "Ya hay un decimal en este número",
	"components.input-number.hintDecimalIncorrectComma": "Para agregar un decimal, utilice la coma “,”",
	"components.input-number.hintDecimalIncorrectPeriod": "Para agregar un decimal, utilice el punto “.”",
	"components.input-number.hintInteger": "Este campo sólo acepta valores enteros (sin decimales)",
	"components.input-search.clear": "Borrar búsqueda",
	"components.input-search.defaultPlaceholder": "Buscar…",
	"components.input-search.search": "Buscar",
	"components.input-time-range.endTime": "Hora de finalización",
	"components.input-time-range.errorBadInput": "{startLabel} debe ser anterior a {endLabel}",
	"components.input-time-range.startTime": "Hora de inicio",
	"components.interactive.instructions": "Pulse Enter para interactuar y Escape para salir",
	"components.link.open-in-new-window": "Se abre en una ventana nueva.",
	"components.list.keyboard": "Utilice las <b>teclas de flecha</b> para mover el enfoque dentro de esta lista, o <b>avanzar/retroceder página</b> para saltar cinco elementos hacia arriba o hacia abajo",
	"components.list-controls.label": "Acciones para la lista",
	"components.list-item.addItem": "Agregar elemento",
	"components.list-item-drag-handle.default": "Reordenar acción de elemento para {name}",
	"components.list-item-drag-handle.keyboard": "Reordenar elementos, posición actual {currentPosition} de {size}. Para mover este elemento, pulse las flechas arriba o abajo.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Alternar el modo de reordenación del teclado.",
	"components.list-item-drag-handle-tooltip.enter-key": "Intro",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Cambiar el nivel de anidamiento.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Izquierda/derecha",
	"components.list-item-drag-handle-tooltip.title": "Controles del teclado para reordenar:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Mover el elemento hacia arriba o hacia abajo en la lista.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Arriba/abajo",
	"components.menu-item-return.return": "Vuelva al menú anterior.",
	"components.menu-item-return.returnCurrentlyShowing": "Vuelva al menú anterior. Está en {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} de {y}",
	"components.meter-mixin.progressIndicator": "Indicador de progreso",
	"components.more-less.less": "menos",
	"components.more-less.more": "más",
	"components.object-property-list.item-placeholder-text": "Elemento de marcador de posición",
	"components.overflow-group.moreActions": "Más acciones",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} elemento}
			other {{countFormatted} elementos}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} de {totalCountFormatted} elemento}
			other {{countFormatted} de {totalCountFormatted} elementos}
		}`,
	"components.pager-load-more.action": "Cargar más",
	"components.pager-load-more.action-with-page-size": "Cargar {count} más",
	"components.pager-load-more.status-loading": "Cargando más elementos",
	"components.selection.action-max-hint":
		`{count, plural,
			one {Deshabilitado cuando se selecciona más de {countFormatted} elemento}
			other {Deshabilitado cuando se seleccionan más de {countFormatted} elementos}
		}`,
	"components.selection.action-required-hint": "Seleccione un elemento para realizar esta acción",
	"components.selection.select-all": "Seleccionar todo",
	"components.selection.select-all-items": "Seleccione los {count} elementos",
	"components.selection.selected": "{count} seleccionados",
	"components.selection.selected-plus": "{count}+ seleccionados",
	"components.selection-controls.label": "Acciones para la selección",
	"components.sort.label": "Ordenar",
	"components.sort.text": "Ordenar: {selectedItemText}",
	"components.switch.conditions": "Deben cumplirse las condiciones",
	"components.switch.hidden": "Oculto",
	"components.switch.visible": "Visible",
	"components.switch.visibleWithPeriod": "Visible.",
	"components.table-col-sort-button.addSortOrder": "Seleccionar para añadir un orden de clasificación",
	"components.table-col-sort-button.changeSortOrder": "Seleccionar para cambiar el orden de clasificación",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Orden de más reciente a más antiguo}
				other {Orden de más antiguo a más reciente}
			}}
			numbers {{direction, select,
				desc {Orden de mayor a menor}
				other {Orden de menor a mayor}
			}}
			words {{direction, select,
				desc {Orden de a Z a la A}
				other {Orden de a A a la Z}
			}}
			value {Sorted {selectedMenuItemText}}
			other {{direction, select,
				desc {Orden descendente}
				other {Orden ascendente}
			}}
		}`,
	"components.table-controls.label": "Acciones para la tabla",
	"components.tabs.next": "Desplazarse hacia delante",
	"components.tabs.previous": "Desplazarse hacia atrás",
	"components.tag-list.clear": "Haga clic, pulse Retroceso o pulse la tecla Supr para eliminar el elemento {value}",
	"components.tag-list.clear-all": "Borrar todo",
	"components.tag-list.cleared-all": "Se han eliminado todos los elementos de la lista de etiquetas",
	"components.tag-list.cleared-item": "Se ha eliminado el elemento {value} de la lista de etiquetas",
	"components.tag-list.interactive-label": "Lista de etiquetas, {count} elementos",
	"components.tag-list.num-hidden": "+ {count} más",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Lista de etiquetas con 0 elementos}
			one {Lista de etiquetas con {count} elemento}
			other {Lista de etiquetas con {count} elementos}
		}`,
	"components.tag-list.show-less": "Mostrar menos",
	"components.tag-list.show-more-description": "Seleccione esta opción para mostrar los elementos ocultos de la lista de etiquetas",
	"components.tag-list-item.role-description": "Etiqueta",
	"components.tag-list-item.tooltip-arrow-keys": "Teclas de flecha",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Desplazamiento entre etiquetas",
	"components.tag-list-item.tooltip-delete-key": "Retroceso/Eliminar",
	"components.tag-list-item.tooltip-delete-key-desc": "Eliminar la etiqueta seleccionada",
	"components.tag-list-item.tooltip-title": "Controles del teclado",
	"templates.primary-secondary.divider": "Divisor de panel secundario",
	"templates.primary-secondary.secondary-panel": "Panel secundario"
};
