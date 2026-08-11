export default {
	"components.alert.close": "Закрыть предупреждение",
	"components.backdrop-loading.loadingAnnouncement": "Загрузка",
	"components.backdrop-loading.loadingCompleteAnnouncement": "Загрузка завершена.",
	"components.backdrop-stale-overlay.message": "This data is out of date.",
	"components.breadcrumbs.breadcrumb": "Хлебная крошка",
	"components.button-add.addItem": "Добавить элемент",
	"components.button-copy.copied": "Копировано!",
	"components.button-copy.error": "Неудачное копирование. Попробуйте еще раз или попробуйте скопировать вручную.",
	"components.button-split.otherOptions": "Другие варианты",
	"components.calendar.hasEvents": "Имеет события.",
	"components.calendar.notSelected": "Не выбрано.",
	"components.calendar.selected": "Выбран.",
	"components.calendar.show": "Показать {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Закрыть это окно",
	"components.dialog.critical": "Критично!",
	"components.dropdown.close": "Закрыть",
	"components.filter.activeFilters": "Активные фильтры:",
	"components.filter.additionalContentTooltip": "Используйте <b>клавиши со стрелками влево/вправо</b> для перемещения фокуса внутри этого элемента списка",
	"components.filter.clear": "Очистить",
	"components.filter.clearAll": "Очистить все",
	"components.filter.clearAllAnnounce": "Очистка всех фильтров",
	"components.filter.clearAllAnnounceOverride": "Очистка всех фильтров для: {filterText}",
	"components.filter.clearAllDescription": "Очистить все фильтры",
	"components.filter.clearAllDescriptionOverride": "Очистить все фильтры для: {filterText}",
	"components.filter.clearAnnounce": "Очистка фильтров для: {filterName}",
	"components.filter.clearDescription": "Очистить фильтры для: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Фильтры не применены.}
			one {Применен {number} фильтр.}
			few {Применено {number} фильтра.}
			many {Применено {number} фильтров.}
			other {Применено {number} фильтра.}
		}`,
	"components.filter.filters": "Фильтры",
	"components.filter.loading": "Загрузка фильтров",
	"components.filter.noFilters": "Нет доступных фильтров",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Нет результатов поиска}
			one {{number} результат поиска}
			few {{number} результата поиска}
			many {{number} результатов поиска}
			other {{number} результата поиска}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText} – первыми отображаются выбранные фильтры.",
	"components.filter.singleDimensionDescription": "Фильтр по: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Сегодня}
			one {За последний {num} день}
			few {За последние {num} дня}
			many {За последние {num} дней}
			other {За последние {num} дня}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {За последний час}
			few {За последние {num} часа}
			many {За последние {num} часов}
			other {За последние {num} часа}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Последние {num} месяцев",
	"components.filter-dimension-set-date-time-range-value.label": "{text} — расширить для выбора дат",
	"components.filter-dimension-set-date-time-range-value.text": "Настраиваемый диапазон дат",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "От {startValue} до {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "До {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "После {startValue}",
	"components.form-element.defaultError": "Параметр {label} недействителен",
	"components.form-element.defaultFieldLabel": "Поле",
	"components.form-element.input.email.typeMismatch": "Адрес электронной почты недействителен",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Число должно быть больше {min} и меньше {max}.}
				other {Число должно быть больше {min} и меньше или равно {max}.}
			}}
			other {{maxExclusive, select,
				true {Число должно быть больше или равно {min} и меньше {max}.}
				other {Число должно быть больше или равно {min} и меньше или равно {max}.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Число должно быть меньше {max}.}
			other {Число должно быть меньше или равно {max}.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Число должно быть больше {min}.}
			other {Число должно быть больше или равно {min}.}
		}`,
	"components.form-element.input.text.tooShort": "{label} должно содержать не менее {minlength} символов",
	"components.form-element.input.url.typeMismatch": "URL неверен",
	"components.form-element.valueMissing": "Обязателен параметр {label}",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {В предоставленной вами информации обнаружена {count} ошибка}
			few {В предоставленной вами информации обнаружено {count} ошибки}
			many {В предоставленной вами информации обнаружено {count} ошибок}
			other {В предоставленной вами информации обнаружено {count} ошибки}
		}`,
	"components.form-error-summary.text": "Переключить сведения об ошибках",
	"components.input-color.backgroundColor": "Цвет фона",
	"components.input-color.foregroundColor": "Цвет переднего плана",
	"components.input-color.none": "Нет",
	"components.input-date.clear": "Очистить",
	"components.input-date.errorMaxDateOnly": "Дата должна быть не позднее {maxDate}",
	"components.input-date.errorMinDateOnly": "Дата должна быть не ранее {minDate}",
	"components.input-date.errorOutsideRange": "Дата должна находиться между {minDate} и {maxDate}",
	"components.input-date.now": "Сейчас",
	"components.input-date.openInstructions": "Используйте формат даты {format}. Нажмите стрелку вниз или клавишу Enter, чтобы открыть мини-календарь.",
	"components.input-date.revert": "Параметр {label} восстановлен к предыдущему значению.",
	"components.input-date.today": "Сегодня",
	"components.input-date.useDateFormat": "Используйте формат даты {format}",
	"components.input-date-range.endDate": "Дата окончания",
	"components.input-date-range.errorBadInput": "{startLabel} должен предшествовать {endLabel}",
	"components.input-date-range.interactive-label": "Ввод диапазона дат",
	"components.input-date-range.startDate": "Дата начала",
	"components.input-date-time.date": "Дата",
	"components.input-date-time.errorMaxDateOnly": "Дата должна быть не позднее {maxDate}",
	"components.input-date-time.errorMinDateOnly": "Дата должна быть не ранее {minDate}",
	"components.input-date-time.errorOutsideRange": "Дата должна находиться между {minDate} и {maxDate}",
	"components.input-date-time.time": "Время",
	"components.input-date-time-range.endDate": "Дата окончания",
	"components.input-date-time-range.errorBadInput": "{startLabel} должен предшествовать {endLabel}",
	"components.input-date-time-range.interactive-label": "Ввод даты и временного диапазона",
	"components.input-date-time-range.startDate": "Дата начала",
	"components.input-date-time-range-to.to": "до",
	"components.input-number.hintDecimalDuplicate": "В этом числе уже есть десятичный разделитель",
	"components.input-number.hintDecimalIncorrectComma": "Чтобы добавить десятичный разделитель, используйте символ запятой «,»",
	"components.input-number.hintDecimalIncorrectPeriod": "Чтобы добавить десятичный разделитель, используйте символ точки «.»",
	"components.input-number.hintInteger": "Это поле принимает только целые значения (без десятичных знаков)",
	"components.input-search.clear": "Очистить поиск",
	"components.input-search.defaultPlaceholder": "Поиск...",
	"components.input-search.search": "Поиск",
	"components.input-time-range.endTime": "Время окончания",
	"components.input-time-range.errorBadInput": "{startLabel} должен предшествовать {endLabel}",
	"components.input-time-range.startTime": "Время начала",
	"components.interactive.instructions": "Нажмите Enter для взаимодействия, Escape для выхода",
	"components.link.open-in-new-window": "Открывается в новом окне.",
	"components.list.keyboard": "Используйте <b>клавиши со стрелками</b> для перемещения фокуса внутри этого списка или клавиши <b>Page Up/Down</b> для перемещения вверх или вниз на 5",
	"components.list-controls.label": "Действия для списка",
	"components.list-item.addItem": "Добавить элемент",
	"components.list-item-drag-handle.default": "Действие по изменению порядка элементов для {name}",
	"components.list-item-drag-handle.keyboard": "Изменить порядок элемента, текущее положение {currentPosition} из {size} . Чтобы переместить этот элемент, нажмите стрелки вверх или вниз.",
	"components.list-item-drag-handle.side-to-side.keyboard": "Изменение порядка элемента, текущее положение {currentPosition} из {size}. Для перемещения этого элемента нажмите стрелки влево или вправо.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Переключить режим изменения порядка клавиатуры.",
	"components.list-item-drag-handle-tooltip.enter-key": "Войти",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Измените уровень вложенности.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Влево/Вправо",
	"components.list-item-drag-handle-tooltip.side-to-side.left-right-desc": "Перемещение элемента влево или вправо в списке.",
	"components.list-item-drag-handle-tooltip.side-to-side.up-down-desc": "Перемещение элемента влево или вправо в списке.",
	"components.list-item-drag-handle-tooltip.title": "Элементы управления клавиатуры для изменения порядка:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Перемещение элемента вверх или вниз в списке.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Вверх/вниз",
	"components.menu-item-return.return": "Вернуться к предыдущему меню.",
	"components.menu-item-return.returnCurrentlyShowing": "Вернуться к предыдущему меню. Вы просматриваете {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} из {y}",
	"components.meter-mixin.progressIndicator": "Показатель прогресса",
	"components.more-less.less": "меньше",
	"components.more-less.more": "еще",
	"components.object-property-list.item-placeholder-text": "Заместительная позиция",
	"components.overflow-group.moreActions": "Другие действия",
	"components.page.footer-region-label": "Нижний колонтитул",
	"components.page.header-nav-label": "Главная",
	"components.page.side-nav-divider-label": "Боковой навигационный разделитель",
	"components.page.side-nav-label": "Сторона",
	"components.page.side-nav-scrim": "Main content is currently hidden by the Side Navigation Panel. Close the panel to access.",
	"components.page.supporting-divider-label": "Опорный разделитель панелей",
	"components.page.supporting-label": "Поддерживающий",
	"components.page.supporting-scrim": "Main content is currently hidden by the Supporting Panel. Close the panel to access.",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} элемент}
			few {{countFormatted} элемента}
			many {{countFormatted} элементов}
			other {{countFormatted} элемента}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} из {totalCountFormatted} элемента}
			few {{countFormatted} из {totalCountFormatted} элементов}
			many {{countFormatted} из {totalCountFormatted} элементов}
			other {{countFormatted} из {totalCountFormatted} элемента}
		}`,
	"components.pager-load-more.action": "Загрузить еще",
	"components.pager-load-more.action-with-page-size": "Загрузить еще {count}",
	"components.pager-load-more.status-loading": "Загрузка дополнительных элементов",
	"components.scroll-wrapper.scroll-left": "Прокрутите влево",
	"components.scroll-wrapper.scroll-right": "Прокрутите вправо",
	"components.selection.action-max-hint":
		`{count, plural,
			one {Отключено, если выбрано более {countFormatted} элемента}
			few {Отключено, если выбрано более {countFormatted} элементов}
			many {Отключено, если выбрано более {countFormatted} элементов}
			other {Отключено, если выбрано более {countFormatted} элемента}
		}`,
	"components.selection.action-required-hint": "Выберите элемент для выполнения этого действия",
	"components.selection.select-all": "Выбрать все",
	"components.selection.select-all-items":
		`{count, plural,
			=1 {Выбрать элемент}
			one {Выбрать все элементы ({countFormatted})}
			few {Выбрать все элементы ({countFormatted})}
			many {Выбрать все элементы ({countFormatted})}
			other {Выбрать все элементы ({countFormatted})}
		}`,
	"components.selection.selected": "Выбран параметр {count}",
	"components.selection.selected-plus": "Выбран параметр {count}+.",
	"components.selection-controls.label": "Действия для выбранных элементов",
	"components.skip-nav.skipToMainContent": "перейти к основному контенту",
	"components.sort.label": "Сортировать",
	"components.sort.text": "сортировать: {selectedItemText}",
	"components.switch.conditions": "Необходимо соблюдать условия",
	"components.switch.hidden": "Скрыто",
	"components.switch.visible": "Видимо",
	"components.switch.visibleWithPeriod": "Видимый",
	"components.table-col-sort-button.addSortOrder": "Выберите, чтобы добавить порядок сортировки",
	"components.table-col-sort-button.changeSortOrder": "Выберите, чтобы изменить порядок сортировки",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Отсортировано от нового к старому}
				other {Отсортировано от старого к новому}
			}}
			numbers {{direction, select,
				desc {Отсортировано от большего к меньшему}
				other {Отсортировано от меньшего к большему}
			}}
			words {{direction, select,
				desc {Отсортировано от Я до А}
				other {Отсортировано от А до Я}
			}}
			value {Отсортировано {selectedMenuItemText}}
			other {{direction, select,
				desc {Отсортировано по убыванию}
				other {Отсортировано по возрастанию}
			}}
		}`,
	"components.table-controls.label": "Действия для таблицы",
	"components.tabs.next": "Прокрутите вперед",
	"components.tabs.previous": "Прокрутка назад",
	"components.tag-list.clear": "Щелкните, нажмите клавишу Backspace или нажмите клавишу Delete, чтобы удалить элемент {value}",
	"components.tag-list.clear-all": "Очистить все",
	"components.tag-list.cleared-all": "Удалены все элементы списка тегов",
	"components.tag-list.cleared-item": "Удален элемент списка тегов {value}",
	"components.tag-list.interactive-label": "Список тегов, {count} элементов",
	"components.tag-list.num-hidden": "+ {count} еще",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {Список тегов с 0 элементов}
			one {Список тегов с {count} элементом}
			few {Список тегов с {count} элементами}
			many {Список тегов с {count} элементами}
			other {Список тегов с {count} элемента}
		}`,
	"components.tag-list.show-less": "Показать меньше",
	"components.tag-list.show-more-description": "Выберите для отображения скрытых элементов списка тегов",
	"components.tag-list-item.role-description": "Тег",
	"components.tag-list-item.tooltip-arrow-keys": "Клавиши со стрелками",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Перемещение между тегами",
	"components.tag-list-item.tooltip-delete-key": "Backspace/Удалить",
	"components.tag-list-item.tooltip-delete-key-desc": "Удалить тег в фокусе",
	"components.tag-list-item.tooltip-title": "Управление клавиатурой",
	"components.view-switcher.role-description":
		`{count, plural,
			=0 {Смотреть переключатель с 0 элементов}
			one {Смотреть переключатель с {count} элементом}
			few {Смотреть переключатель с {count} элементами}
			many {Смотреть переключатель с {count} элементами}
			other {Смотреть переключатель с {count} элемента}
		}`,
	"templates.primary-secondary.divider": "Вторичный разделитель панели",
	"templates.primary-secondary.secondary-panel": "Вторичная группа"
};
