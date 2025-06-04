export default {
	"components.alert.close": "Fechar alerta",
	"components.breadcrumbs.breadcrumb": "Auxiliar de navegação",
	"components.button-add.addItem": "Adicionar item",
	"components.button-split.otherOptions": "Outras Opções",
	"components.calendar.hasEvents": "Tem eventos.",
	"components.calendar.notSelected": "Não selecionado.",
	"components.calendar.selected": "Selecionado.",
	"components.calendar.show": "Mostrar {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Fechar esta caixa de diálogo",
	"components.dialog.critical": "Crítico!",
	"components.dropdown.close": "Fechar",
	"components.filter.activeFilters": "Filtros ativos:",
	"components.filter.additionalContentTooltip": "Use as <b>teclas de seta para a esquerda/direita</b> para mover o foco dentro desse item da lista",
	"components.filter.clear": "Limpar",
	"components.filter.clearAll": "Limpar tudo",
	"components.filter.clearAllAnnounce": "Limpando todos os filtros",
	"components.filter.clearAllAnnounceOverride": "Limpando todos os filtros para: {filterText}",
	"components.filter.clearAllDescription": "Limpar todos os filtros",
	"components.filter.clearAllDescriptionOverride": "Limpar todos os filtros para: {filterText}",
	"components.filter.clearAnnounce": "Limpando filtros para: {filterName}",
	"components.filter.clearDescription": "Limpar filtros para: {filterName}",
	"components.filter.loading": "Carregar filtros",
	"components.filter.filterCountDescription":
		`{number, plural,
		=0 {Nenhum filtro aplicado.}
		one {{number} filtro aplicado.}
		other {{number} filtros aplicados.}
	}`,
	"components.filter.filters": "Filtros",
	"components.filter.noFilters": "Não há filtros disponíveis",
	"components.filter.searchResults":
		`{number, plural,
		=0 {Sem resultados para a pesquisa}
		one {{number} resultado para a pesquisa}
		other {{number} resultados para a pesquisa}
	}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Os filtros selecionados aparecem primeiro.",
	"components.filter.singleDimensionDescription": "Filtrar por: {filterName}",
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
		=1 {Última hora}
		other {Últimas {num} horas}
	}`,
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
		=0 {Hoje}
		one {Último {num} dia}
		other {Últimos {num} dias}
	}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Últimos {num} meses",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, expandir para escolher datas",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} até {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "Depois de {startValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "Antes de {endValue}",
	"components.filter-dimension-set-date-time-range-value.text": "Intervalo de datas personalizado",
	"components.form-element.defaultError": "{label} é inválido",
	"components.form-element.defaultFieldLabel": "Campo",
	"components.form-element.input.email.typeMismatch": "E-mail inválido",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
		true {{maxExclusive, select,
			true {O número deve ser maior que {min} e menor que {max}.}
			other {O número deve ser maior que {min} e menor que ou igual a {max}.}
		}}
		other {{maxExclusive, select,
			true {O número deve ser maior ou igual a {min} e menor que {max}.}
			other {O número deve ser maior que ou igual a {min} e menor que ou igual a {max}.}
		}}
	}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
		true {O número deve ser menor que {max}.}
		other {O número deve ser menor que ou igual a {max}.}
	}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
		true {O número deve ser maior que {min}.}
		other {O número deve ser maior que ou igual a {min}.}
	}`,
	"components.form-element.input.text.tooShort": "{label} precisa ter, pelo menos, {minlength} caracteres",
	"components.form-element.input.url.typeMismatch": "URL inválido",
	"components.form-element.valueMissing": "{label} é obrigatório",
	"components.form-error-summary.errorSummary":
		`{count, plural,
		one {{count} erro foi encontrado nas informações enviadas}
		other {{count} erros foram encontrados nas informações enviadas}
	}`,
	"components.form-error-summary.text": "Alternar detalhes do erro",
	"components.input-color.backgroundColor": "Cor do Plano de fundo",
	"components.input-color.foregroundColor": "Cor do Primeiro plano",
	"components.input-color.none": "Nenhum",
	"components.input-date-range.endDate": "Data Final",
	"components.input-date-range.errorBadInput": "{startLabel} precisa ser anterior a {endLabel}",
	"components.input-date-range.interactive-label": "Entrada do intervalo de datas",
	"components.input-date-range.startDate": "Data de Início",
	"components.input-date-time-range-to.to": "para",
	"components.input-date-time-range.endDate": "Data Final",
	"components.input-date-time-range.errorBadInput": "{startLabel} precisa ser anterior a {endLabel}",
	"components.input-date-time-range.startDate": "Data de Início",
	"components.input-date-time.date": "Data",
	"components.input-date-time.errorMaxDateOnly": "A data deve ser anterior ou igual a {maxDate}",
	"components.input-date-time.errorMinDateOnly": "A data deve ser igual ou posterior a {minDate}",
	"components.input-date-time.errorOutsideRange": "A data precisa estar entre {minDate} e {maxDate}",
	"components.input-date-time.time": "Hora",
	"components.input-date-time-range.interactive-label": "Entrada de intervalo de data e hora",
	"components.input-date.clear": "Limpar",
	"components.input-date.errorMaxDateOnly": "A data deve ser anterior ou igual a {maxDate}",
	"components.input-date.errorMinDateOnly": "A data deve ser igual ou posterior a {minDate}",
	"components.input-date.errorOutsideRange": "A data precisa estar entre {minDate} e {maxDate}",
	"components.input-date.openInstructions": "Adote o formato de data {format}. Use a tecla de seta para baixo ou pressione Enter para acessar o minicalendário.",
	"components.input-date.now": "Agora",
	"components.input-date.revert": "{label} foi revertido para o valor anterior.",
	"components.input-date.today": "Hoje",
	"components.input-date.useDateFormat": "Adote o formato de data {format}.",
	"components.input-number.hintInteger": "Este campo aceita apenas valores inteiros (não decimais)",
	"components.input-number.hintDecimalDuplicate": "Já existe um decimal neste número",
	"components.input-number.hintDecimalIncorrectComma": "Para adicionar um decimal, use o caractere vírgula “,”",
	"components.input-number.hintDecimalIncorrectPeriod": "Para adicionar um decimal, use o caractere ponto “.”",
	"components.input-search.clear": "Limpar pesquisa",
	"components.input-search.defaultPlaceholder": "Pesquisar...",
	"components.input-search.search": "Pesquisar",
	"components.input-time-range.endTime": "Hora final",
	"components.input-time-range.errorBadInput": "{startLabel} precisa ser anterior a {endLabel}",
	"components.input-time-range.startTime": "Hora de início",
	"components.interactive.instructions": "Pressione Enter para interagir, Escape para sair",
	"components.link.open-in-new-window": "Abre em uma nova janela.",
	"components.list.keyboard": "Use <b>teclas de seta</b> para mover o foco dentro dessa lista, ou <b>página acima/abaixo</b> para subir ou descer 5",
	"components.list-controls.label": "Ações para a lista",
	"components.list-item.addItem": "Adicionar item",
	"components.list-item-drag-handle.default": "Reordenar ação de item para {name}",
	"components.list-item-drag-handle.keyboard": "Reordenar item, posição atual {currentPosition} de {size}. Para mover este item, pressione as setas para cima ou para baixo.",
	"components.list-item-drag-handle-tooltip.title": "Controles do teclado para reordenação:",
	"components.list-item-drag-handle-tooltip.enter-key": "Inserir",
	"components.list-item-drag-handle-tooltip.enter-desc": "Alternar o modo de reordenação do teclado.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Para cima/para baixo",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Mover item para cima ou para baixo na lista.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Esquerda/direita",
	"components.list-item-drag-handle-tooltip.left-right-desc": "Alterar o nível de aninhamento.",
	"components.menu-item-return.return": "Voltar ao menu anterior.",
	"components.menu-item-return.returnCurrentlyShowing": "Voltar ao menu anterior. Você está visualizando {menuTitle}.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} de {y}",
	"components.meter-mixin.progressIndicator": "Indicador de progresso",
	"components.more-less.less": "menos",
	"components.more-less.more": "mais",
	"components.object-property-list.item-placeholder-text": "Item de espaço reservado",
	"components.overflow-group.moreActions": "Mais ações",
	"components.pager-load-more.action": "Carregar Mais",
	"components.pager-load-more.action-with-page-size": "Carregar mais {count}",
	"components.pageable.info":
		`{count, plural,
		one {{countFormatted} item}
		other {{countFormatted} itens}
	}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
		one {{countFormatted} de {totalCountFormatted} item}
		other {{countFormatted} de {totalCountFormatted} itens}
	}`,
	"components.pager-load-more.status-loading": "Carregando mais itens",
	"components.selection.action-max-hint":
		`{count, plural,
		one {Desativado quando mais de {countFormatted} item é selecionado}
		other {Desativado quando mais de {countFormatted} itens são selecionados}
	}`,
	"components.selection.action-required-hint": "Selecione um item para realizar esta ação",
	"components.selection.select-all": "Selecionar Tudo",
	"components.selection.select-all-items": "Selecione todos os {count} itens",
	"components.selection.selected": "{count} selecionados",
	"components.selection.selected-plus": "Mais de {count} selecionados",
	"components.selection-controls.label": "Ações para seleção",
	"components.switch.visible": "Visível",
	"components.switch.visibleWithPeriod": "Visível.",
	"components.switch.hidden": "Oculto",
	"components.switch.conditions": "As condições devem ser atendidas",
	"components.table-col-sort-button.addSortOrder": "Selecione para adicionar a ordem de classificação",
	"components.table-col-sort-button.changeSortOrder": "Selecione para alterar a ordem de classificação",
	"components.table-col-sort-button.title":
		`{sourceType, select,
		dates {{direction, select,
			desc {Ordenado do mais recente ao mais antigo}
			other {Ordenado do mais antigo ao mais recente}
		}}
		numbers {{direction, select,
			desc {Ordenado do maior para o menor}
			other {Ordenado do menor para o maior}
		}}
		words {{direction, select,
			desc {Ordenado de Z a A}
			other {Ordenado de A a Z}
		}}
		value {Ordenado {selectedMenuItemText}}
		other {{direction, select,
			desc {Ordenado em ordem decrescente}
			other {Ordenado em ordem crescente}
		}}
	}`,
	"components.table-controls.label": "Ações para a tabela",
	"components.tabs.next": "Ir para frente",
	"components.tabs.previous": "Ir para trás",
	"components.tag-list.clear": "Clique, pressione a tecla Backspace ou a tecla Delete para remover o item {value}",
	"components.tag-list.clear-all": "Limpar tudo",
	"components.tag-list.cleared-all": "Todos os itens da lista de etiquetas foram removidos",
	"components.tag-list.cleared-item": "Item {value} da lista de etiquetas removido",
	"components.tag-list.interactive-label": "Lista de marcas, {count} itens",
	"components.tag-list.num-hidden": "+ {count} mais",
	"components.tag-list.role-description": "Lista de marcas",
	"components.tag-list.show-less": "Mostrar menos",
	"components.tag-list.show-more-description": "Selecione para mostrar itens ocultos da lista de etiquetas",
	"components.tag-list-item.role-description": "Marca",
	"components.tag-list-item.tooltip-arrow-keys": "Teclas de seta",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Mover entre etiquetas",
	"components.tag-list-item.tooltip-delete-key": "Backspace/Delete",
	"components.tag-list-item.tooltip-delete-key-desc": "Excluir a etiqueta de foco",
	"components.tag-list-item.tooltip-title": "Controles do teclado",
	"templates.primary-secondary.divider": "Divisor do painel secundário",
	"templates.primary-secondary.secondary-panel": "Painel secundário"
};
