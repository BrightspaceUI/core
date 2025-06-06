export default {
	"components.alert.close": "关闭提醒",
	"components.breadcrumbs.breadcrumb": "痕迹导航",
	"components.button-add.addItem": "添加项目",
	"components.button-split.otherOptions": "其他选项",
	"components.calendar.hasEvents": "有事件。",
	"components.calendar.notSelected": "未选择。",
	"components.calendar.selected": "已选择。",
	"components.calendar.show": "显示 {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "关闭此对话框",
	"components.dialog.critical": "严重问题！",
	"components.dropdown.close": "关闭",
	"components.filter.activeFilters": "活动筛选器：",
	"components.filter.additionalContentTooltip": "使用<b>左/右箭头键</b>在此列表项内移动焦点",
	"components.filter.clear": "清除",
	"components.filter.clearAll": "全部清除",
	"components.filter.clearAllAnnounce": "清除所有筛选器",
	"components.filter.clearAllAnnounceOverride": "正在清除 {filterText} 的所有筛选器",
	"components.filter.clearAllDescription": "清除所有筛选器",
	"components.filter.clearAllDescriptionOverride": "清除 {filterText} 的所有筛选器",
	"components.filter.clearAnnounce": "正在清除筛选器：{filterName}",
	"components.filter.clearDescription": "清除筛选条件：{filterName}",
	"components.filter.loading": "正在加载筛选器",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {未应用筛选器。}
			other {已应用 {number} 个筛选器。}
		}`,
	"components.filter.filters": "个筛选条件",
	"components.filter.noFilters": "无可用筛选器",
	"components.filter.searchResults":
		`{number, plural,
			=0 {无搜索结果}
			other {{number} 个搜索结果}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}。先显示所选筛选器。",
	"components.filter.singleDimensionDescription": "筛选依据：{filterName}",
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			other {过去 {num} 小时}
		}`,
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {今天}
			other {过去 {num} 天}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "过去 {num} 个月",
	"components.filter-dimension-set-date-time-range-value.label": "{text}，扩展以选择日期",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} 至 {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "在 {startValue} 之后",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "在 {endValue} 之前",
	"components.filter-dimension-set-date-time-range-value.text": "自定义日期范围",
	"components.form-element.defaultError": "{label} 无效",
	"components.form-element.defaultFieldLabel": "字段",
	"components.form-element.input.email.typeMismatch": "电子邮件无效",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {数目必须大于 {min} 且小于 {max}。}
				other {数目必须大于 {min} 且小于或等于 {max}。}
			}}
			other {{maxExclusive, select,
				true {数目必须大于或等于 {min} 且小于 {max}。}
				other {数目必须大于或等于 {min} 且小于或等于 {max}。}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {数字必须小于 {max}。}
			other {数字必须小于等于 {max}。}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {数字必须大于 {min}。}
			other {数字必须大于等于 {min}。}
		}`,
	"components.form-element.input.text.tooShort": "{label} 必须至少为 {minlength} 个字符",
	"components.form-element.input.url.typeMismatch": "URL 无效",
	"components.form-element.valueMissing": "{label} 为必填项",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			other {在您提交的信息中发现 {count} 个错误}
		}`,
	"components.form-error-summary.text": "切换错误详细信息",
	"components.input-color.backgroundColor": "背景颜色",
	"components.input-color.foregroundColor": "前景颜色",
	"components.input-color.none": "无",
	"components.input-date-range.endDate": "结束日期",
	"components.input-date-range.errorBadInput": "{startLabel} 必须早于 {endLabel}",
	"components.input-date-range.interactive-label": "日期范围输入",
	"components.input-date-range.startDate": "开始日期",
	"components.input-date-time-range-to.to": "至",
	"components.input-date-time-range.endDate": "结束日期",
	"components.input-date-time-range.errorBadInput": "{startLabel} 必须早于 {endLabel}",
	"components.input-date-time-range.startDate": "开始日期",
	"components.input-date-time.date": "日期",
	"components.input-date-time.errorMaxDateOnly": "日期必须早于或等于 {maxDate}",
	"components.input-date-time.errorMinDateOnly": "日期必须晚于或等于 {minDate}",
	"components.input-date-time.errorOutsideRange": "日期必须介于 {minDate} 和 {maxDate} 之间",
	"components.input-date-time.time": "时间",
	"components.input-date-time-range.interactive-label": "日期和时间范围输入",
	"components.input-date.clear": "清除",
	"components.input-date.errorMaxDateOnly": "日期必须早于或等于 {maxDate}",
	"components.input-date.errorMinDateOnly": "日期必须晚于或等于 {minDate}",
	"components.input-date.errorOutsideRange": "日期必须介于 {minDate} 和 {maxDate} 之间",
	"components.input-date.openInstructions": "使用日期格式 {format}。利用向下箭头键或按 Enter 键访问迷你日历。",
	"components.input-date.now": "现在",
	"components.input-date.revert": "{label} 已恢复到前一个值。",
	"components.input-date.today": "今天",
	"components.input-date.useDateFormat": "使用日期格式 {format}。",
	"components.input-number.hintInteger": "此字段只接受整数值（无小数）",
	"components.input-number.hintDecimalDuplicate": "此数中已有一个小数",
	"components.input-number.hintDecimalIncorrectComma": "要添加小数，请使用逗号“,”字符",
	"components.input-number.hintDecimalIncorrectPeriod": "要添加小数，请使用句号“.”字符",
	"components.input-search.clear": "清除搜索",
	"components.input-search.defaultPlaceholder": "搜索...",
	"components.input-search.search": "搜索",
	"components.input-time-range.endTime": "结束时间",
	"components.input-time-range.errorBadInput": "{startLabel} 必须早于 {endLabel}",
	"components.input-time-range.startTime": "开始时间",
	"components.interactive.instructions": "按 Enter 键进行交互，按 Esc 键退出",
	"components.link.open-in-new-window": "在新窗口中打开。",
	"components.list.keyboard": "使用<b>箭头键</b>在此列表中移动焦点，或使用<b>上/下翻页</b>以 5 个列表项为幅度进行上移或下移",
	"components.list-controls.label": "针对列表的操作",
	"components.list-item.addItem": "添加项目",
	"components.list-item-drag-handle.default": "对 {name} 的项目操作重新排序",
	"components.list-item-drag-handle.keyboard": "对项目重新排序，当前位置 {currentPosition} 超出 {size}。要移动此项目，请按向上或向下箭头。",
	"components.list-item-drag-handle-tooltip.title": "用于重新排序的键盘控制键：",
	"components.list-item-drag-handle-tooltip.enter-key": "输入",
	"components.list-item-drag-handle-tooltip.enter-desc": "切换键盘重新排序模式。",
	"components.list-item-drag-handle-tooltip.up-down-key": "向上/向下",
	"components.list-item-drag-handle-tooltip.up-down-desc": "在列表中向上或向下移动项目。",
	"components.list-item-drag-handle-tooltip.left-right-key": "向左/向右",
	"components.list-item-drag-handle-tooltip.left-right-desc": "更改嵌套层。",
	"components.menu-item-return.return": "返回至上级菜单。",
	"components.menu-item-return.returnCurrentlyShowing": "返回至上级菜单。您正在浏览 {menuTitle}。",
	"components.meter-mixin.commaSeperatedAria": "{term1}、{term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x}/{y}",
	"components.meter-mixin.progressIndicator": "进度指示符",
	"components.more-less.less": "更少",
	"components.more-less.more": "更多",
	"components.object-property-list.item-placeholder-text": "占位符项目",
	"components.overflow-group.moreActions": "更多操作",
	"components.pager-load-more.action": "加载更多",
	"components.pager-load-more.action-with-page-size": "再加载 {count} 个",
	"components.pageable.info":
		`{count, plural,
			other {{countFormatted} 项}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			other {{countFormatted}/{totalCountFormatted} 项}
		}`,
	"components.pager-load-more.status-loading": "加载更多项目",
	"components.selection.action-max-hint":
		`{count, plural,
			other {选择的项目超过 {countFormatted} 个时禁用}
		}`,
	"components.selection.action-required-hint": "选择一个项目后才能执行此操作",
	"components.selection.select-all": "全选",
	"components.selection.select-all-items": "选择全部 {count} 个项目",
	"components.selection.selected": "已选 {count}",
	"components.selection.selected-plus": "已选 + {count}",
	"components.selection-controls.label": "针对所选内容的操作",
	"components.switch.visible": "可见",
	"components.switch.visibleWithPeriod": "可见。",
	"components.switch.hidden": "隐藏",
	"components.switch.conditions": "必须符合条件",
	"components.table-col-sort-button.addSortOrder": "选择添加排序顺序",
	"components.table-col-sort-button.changeSortOrder": "选择更改排序顺序",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {从新到旧排序}
				other {从旧到新排序}
			}}
			numbers {{direction, select,
				desc {从高到低排序}
				other {从低到高排序}
			}}
			words {{direction, select,
				desc {从 Z 到 A 排序}
				other {从 A 到 Z 排序}
			}}
			value {{selectedMenuItemText} 排序}
			other {{direction, select,
				desc {降序排序}
				other {升序排序}
			}}
		}`,
	"components.table-controls.label": "对表格的操作",
	"components.tabs.next": "向前滚动",
	"components.tabs.previous": "向后滚动",
	"components.tag-list.clear": "单击、按退格键或按 Delete 键以移除项目 {value}",
	"components.tag-list.clear-all": "全部清除",
	"components.tag-list.cleared-all": "已移除所有标签列表项目",
	"components.tag-list.cleared-item": "已移除标签列表项目 {value}",
	"components.tag-list.interactive-label": "标签列表，{count} 个项目",
	"components.tag-list.num-hidden": "+ {count} 个",
	"components.tag-list.role-description": "标签列表",
	"components.tag-list.show-less": "显示更少",
	"components.tag-list.show-more-description": "选择以显示隐藏的标签列表项目",
	"components.tag-list-item.role-description": "标记",
	"components.tag-list-item.tooltip-arrow-keys": "箭头键",
	"components.tag-list-item.tooltip-arrow-keys-desc": "在标签之间移动",
	"components.tag-list-item.tooltip-delete-key": "退格键/Delete 键",
	"components.tag-list-item.tooltip-delete-key-desc": "删除具有焦点的标签",
	"components.tag-list-item.tooltip-title": "键盘控制",
	"templates.primary-secondary.divider": "辅助面板分隔条",
	"templates.primary-secondary.secondary-panel": "辅助面板"
};
