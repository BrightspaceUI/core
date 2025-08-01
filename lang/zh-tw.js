export default {
	"components.alert.close": "關閉警示",
	"components.breadcrumbs.breadcrumb": "導覽路徑",
	"components.button-add.addItem": "新增項目",
	"components.button-split.otherOptions": "其他選項",
	"components.calendar.hasEvents": "有事件。",
	"components.calendar.notSelected": "未選取。",
	"components.calendar.selected": "已選取。",
	"components.calendar.show": "顯示{month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "關閉此對話方塊",
	"components.dialog.critical": "重大！",
	"components.dropdown.close": "關閉",
	"components.filter.activeFilters": "啟用中的篩選器：",
	"components.filter.additionalContentTooltip": "使用<b>左 / 右箭頭鍵</b>在此清單項目內移動焦點",
	"components.filter.clear": "清除",
	"components.filter.clearAll": "全部清除",
	"components.filter.clearAllAnnounce": "正在清除所有篩選器",
	"components.filter.clearAllAnnounceOverride": "正在清除下列項目的所有篩選器：{filterText}",
	"components.filter.clearAllDescription": "清除所有篩選器",
	"components.filter.clearAllDescriptionOverride": "清除下列項目的所有篩選器：{filterText}",
	"components.filter.clearAnnounce": "正在清除 {filterName} 的篩選器",
	"components.filter.clearDescription": "清除 {filterName} 的篩選器",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {未套用篩選器。}
			other {已套用 {number} 個篩選器。}
		}`,
	"components.filter.filters": "篩選器",
	"components.filter.loading": "正在載入篩選條件",
	"components.filter.noFilters": "沒有可用的篩選條件",
	"components.filter.searchResults":
		`{number, plural,
			=0 {無搜尋結果}
			other {{number} 個搜尋結果}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}。所選篩選器會先顯示。",
	"components.filter.singleDimensionDescription": "按此條件篩選：{filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {今天}
			other {過去 {num} 天}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {過去一小時}
			other {過去 {num} 小時}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "過去 {num} 個月",
	"components.filter-dimension-set-date-time-range-value.label": "{text}，展開以選擇日期",
	"components.filter-dimension-set-date-time-range-value.text": "自訂日期範圍",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} 到 {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "{endValue} 之前",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "{startValue} 之後",
	"components.form-element.defaultError": "{label} 無效",
	"components.form-element.defaultFieldLabel": "欄位",
	"components.form-element.input.email.typeMismatch": "電子郵件無效",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {數字必須大於 {min} 且小於 {max}。}
				other {數字必須大於 {min} 且小於或等於 {max}。}
			}}
			other {{maxExclusive, select,
				true {數字必須大於或等於 {min} 且小於 {max}。}
				other {數字必須大於或等於 {min} 且小於或等於 {max}。}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {數字必須小於 {max}。}
			other {數字必須小於或等於 {max}。}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {數字必須大於 {min}。}
			other {數字必須大於或等於 {min}。}
		}`,
	"components.form-element.input.text.tooShort": "{label} 必須至少為 {minlength} 個字元",
	"components.form-element.input.url.typeMismatch": "URL 無效",
	"components.form-element.valueMissing": "{label} 為必填",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			other {您提交的資訊中發現 {count} 個錯誤}
		}`,
	"components.form-error-summary.text": "切換錯誤詳細資料",
	"components.input-color.backgroundColor": "背景顏色",
	"components.input-color.foregroundColor": "前景顏色",
	"components.input-color.none": "無",
	"components.input-date.clear": "清除",
	"components.input-date.errorMaxDateOnly": "日期必須早於 {maxDate} 或為當日",
	"components.input-date.errorMinDateOnly": "日期必須晚於 {minDate} 或為當日",
	"components.input-date.errorOutsideRange": "日期必須介於 {minDate} 與 {maxDate} 之間",
	"components.input-date.now": "立即",
	"components.input-date.openInstructions": "使用日期格式 {format}。按向下箭頭，或按下「Enter」以存取迷你行事曆。",
	"components.input-date.revert": "{label} 已還原為先前的值。",
	"components.input-date.today": "今天",
	"components.input-date.useDateFormat": "使用日期格式 {format}。",
	"components.input-date-range.endDate": "結束日期",
	"components.input-date-range.errorBadInput": "{startLabel} 必須早於 {endLabel}",
	"components.input-date-range.interactive-label": "輸入日期範圍",
	"components.input-date-range.startDate": "開始日期",
	"components.input-date-time.date": "日期",
	"components.input-date-time.errorMaxDateOnly": "日期必須早於 {maxDate} 或為當日",
	"components.input-date-time.errorMinDateOnly": "日期必須晚於 {minDate} 或為當日",
	"components.input-date-time.errorOutsideRange": "日期必須介於 {minDate} 與 {maxDate} 之間",
	"components.input-date-time.time": "時間",
	"components.input-date-time-range.endDate": "結束日期",
	"components.input-date-time-range.errorBadInput": "{startLabel} 必須早於 {endLabel}",
	"components.input-date-time-range.interactive-label": "輸入日期與時間範圍",
	"components.input-date-time-range.startDate": "開始日期",
	"components.input-date-time-range-to.to": "至",
	"components.input-number.hintDecimalDuplicate": "這個數字已經有一個小數位數",
	"components.input-number.hintDecimalIncorrectComma": "若要新增小數位數，請使用逗號「,」字元",
	"components.input-number.hintDecimalIncorrectPeriod": "若要新增小數位數，請使用句號「.」字元",
	"components.input-number.hintInteger": "此欄位僅接受整數值 (無小數位數)",
	"components.input-search.clear": "清除搜尋",
	"components.input-search.defaultPlaceholder": "搜尋...",
	"components.input-search.search": "搜尋",
	"components.input-time-range.endTime": "結束時間",
	"components.input-time-range.errorBadInput": "{startLabel} 必須早於 {endLabel}",
	"components.input-time-range.startTime": "開始時間",
	"components.interactive.instructions": "按下 Enter 來互動，按下 Escape 即可結束",
	"components.link.open-in-new-window": "在新視窗中開啟。",
	"components.list.keyboard": "使用<b>方向鍵</b>在此清單內移動焦點，或使用<b>頁面上捲/下捲</b>向上或向下移動 5 個項目",
	"components.list-controls.label": "清單的動作",
	"components.list-item.addItem": "新增項目",
	"components.list-item-drag-handle.default": "重新排序 {name} 的項目動作",
	"components.list-item-drag-handle.keyboard": "重新排序項目，目前位置 {currentPosition}，總共為 {size}。若要移除這個項目，請按向上或向下箭頭。",
	"components.list-item-drag-handle-tooltip.enter-desc": "切換鍵盤重新排序模式。",
	"components.list-item-drag-handle-tooltip.enter-key": "輸入",
	"components.list-item-drag-handle-tooltip.left-right-desc": "變更巢套層次。",
	"components.list-item-drag-handle-tooltip.left-right-key": "左 / 右",
	"components.list-item-drag-handle-tooltip.title": "重新排序的鍵盤控制項：",
	"components.list-item-drag-handle-tooltip.up-down-desc": "在清單中上下移動項目。",
	"components.list-item-drag-handle-tooltip.up-down-key": "上 / 下",
	"components.menu-item-return.return": "返回上一個功能表。",
	"components.menu-item-return.returnCurrentlyShowing": "返回上一個功能表。您正在檢視 {menuTitle}。",
	"components.meter-mixin.commaSeperatedAria": "{term1}，{term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} / {y}",
	"components.meter-mixin.progressIndicator": "進度指示器",
	"components.more-less.less": "較少",
	"components.more-less.more": "較多",
	"components.object-property-list.item-placeholder-text": "預留位置項目",
	"components.overflow-group.moreActions": "其他動作",
	"components.pageable.info":
		`{count, plural,
			other {{countFormatted} 個項目}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			other {{countFormatted} 項，共 {totalCountFormatted} 項}
		}`,
	"components.pager-load-more.action": "載入更多",
	"components.pager-load-more.action-with-page-size": "再載入 {count} 個",
	"components.pager-load-more.status-loading": "正在載入更多項目",
	"components.selection.action-max-hint":
		`{count, plural,
			other {選取超過 {countFormatted} 個項目時即停用}
		}`,
	"components.selection.action-required-hint": "選取項目以執行此動作",
	"components.selection.select-all": "全選",
	"components.selection.select-all-items": "選取所有 {count} 個項目",
	"components.selection.selected": "已選取 {count} 個",
	"components.selection.selected-plus": "已選取 {count}+ 個",
	"components.selection-controls.label": "選擇的動作",
	"components.sort.label": "排序",
	"components.sort.text": "排序：{selectedItemText}",
	"components.switch.conditions": "必須符合條件",
	"components.switch.hidden": "隱藏",
	"components.switch.visible": "可見",
	"components.switch.visibleWithPeriod": "可見。",
	"components.table-col-sort-button.addSortOrder": "選取以新增排序順序",
	"components.table-col-sort-button.changeSortOrder": "選取以變更排序順序",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {已排序為新至舊}
				other {已排序為舊至新}
			}}
			numbers {{direction, select,
				desc {已排序為高到低}
				other {已排序為低到高}
			}}
			words {{direction, select,
				desc {已排序為 Z 到 A}
				other {已排序為 A 到 Z}
			}}
			value {已排序 {selectedMenuItemText}}
			other {{direction, select,
				desc {已遞減排序}
				other {已遞增排序}
			}}
		}`,
	"components.table-controls.label": "表格動作",
	"components.tabs.next": "向前捲動",
	"components.tabs.previous": "向後捲動",
	"components.tag-list.clear": "按一下、按下退格鍵或按下刪除鍵以移除項目 {value}",
	"components.tag-list.clear-all": "全部清除",
	"components.tag-list.cleared-all": "已移除所有標記清單項目",
	"components.tag-list.cleared-item": "已移除標記清單項目 {value}",
	"components.tag-list.interactive-label": "標記清單，{count} 個項目",
	"components.tag-list.num-hidden": "還有 {count} 個",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {標記列表包含 0 個項目}
			other {標記列表包含 {count} 個項目}
		}`,
	"components.tag-list.show-less": "顯示更少",
	"components.tag-list.show-more-description": "選取以顯示隱藏的標記清單項目",
	"components.tag-list-item.role-description": "標記",
	"components.tag-list-item.tooltip-arrow-keys": "方向鍵",
	"components.tag-list-item.tooltip-arrow-keys-desc": "在標記之間移動",
	"components.tag-list-item.tooltip-delete-key": "退格/刪除",
	"components.tag-list-item.tooltip-delete-key-desc": "刪除對焦標記",
	"components.tag-list-item.tooltip-title": "鍵盤控制項",
	"templates.primary-secondary.divider": "次要面板分隔線",
	"templates.primary-secondary.secondary-panel": "次要面板"
};
