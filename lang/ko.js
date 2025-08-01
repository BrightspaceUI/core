export default {
	"components.alert.close": "경보 닫기",
	"components.breadcrumbs.breadcrumb": "이동 경로",
	"components.button-add.addItem": "항목 추가",
	"components.button-split.otherOptions": "기타 옵션",
	"components.calendar.hasEvents": "이벤트가 있습니다.",
	"components.calendar.notSelected": "선택되지 않음.",
	"components.calendar.selected": "선택됨.",
	"components.calendar.show": "{month} 표시",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "이 대화 상자 닫기",
	"components.dialog.critical": "중요!",
	"components.dropdown.close": "닫기",
	"components.filter.activeFilters": "활성 필터:",
	"components.filter.additionalContentTooltip": "이 목록 항목 내에서 포커스를 이동하려면 <b>왼쪽/오른쪽 화살표 키</b>를 사용합니다",
	"components.filter.clear": "지우기",
	"components.filter.clearAll": "모두 지우기",
	"components.filter.clearAllAnnounce": "모든 필터 지우기",
	"components.filter.clearAllAnnounceOverride": "{filterText}에 대한 모든 필터 지우기",
	"components.filter.clearAllDescription": "모든 필터 지우기",
	"components.filter.clearAllDescriptionOverride": "{filterText}에 대한 모든 필터 지우기",
	"components.filter.clearAnnounce": "{filterName}에 대한 필터 지우기",
	"components.filter.clearDescription": "{filterName}에 대한 필터를 지웁니다.",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {적용된 필터 없음.}
			other {{number}개 필터 적용됨.}
		}`,
	"components.filter.filters": "개 필터",
	"components.filter.loading": "필터 로드 중",
	"components.filter.noFilters": "사용 가능한 필터가 없습니다",
	"components.filter.searchResults":
		`{number, plural,
			=0 {검색 결과 없음}
			other {{number}개 검색 결과}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. 선택한 필터가 먼저 나타납니다.",
	"components.filter.singleDimensionDescription": "필터 기준: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {오늘}
			other {지난 {num}일}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			other {지난 {num}시간}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "지난 {num}개월",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, 확장하여 날짜 선택",
	"components.filter-dimension-set-date-time-range-value.text": "사용자 지정 날짜 범위",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue}~{endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "{endValue} 이전",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "{startValue} 이후",
	"components.form-element.defaultError": "{label}이(가) 유효하지 않습니다",
	"components.form-element.defaultFieldLabel": "필드",
	"components.form-element.input.email.typeMismatch": "이메일이 유효하지 않습니다.",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {숫자는 {min}보다 크고 {max}보다 작아야 합니다.}
				other {숫자는 {min}보다 크고 {max}보다 작거나 같아야 합니다.}
			}}
			other {{maxExclusive, select,
				true {숫자는 {min}보다 크거나 같고 {max}보다 작아야 합니다.}
				other {숫자는 {min}보다 크거나 같고 {max}보다 작거나 같아야 합니다.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {숫자는 {max}보다 작아야 합니다.}
			other {숫자는 {max}보다 작거나 같아야 합니다.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {숫자는 {min}보다 커야 합니다.}
			other {숫자는 {min}보다 크거나 같아야 합니다.}
		}`,
	"components.form-element.input.text.tooShort": "{label}은(는) {minlength}자 이상이어야 합니다",
	"components.form-element.input.url.typeMismatch": "URL이 유효하지 않습니다",
	"components.form-element.valueMissing": "{label}이(가) 필요합니다",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			other {제출한 정보에서 {count}개의 오류가 발견되었습니다}
		}`,
	"components.form-error-summary.text": "오류 세부 정보 전환",
	"components.input-color.backgroundColor": "배경 색상",
	"components.input-color.foregroundColor": "전경 색상",
	"components.input-color.none": "없음",
	"components.input-date.clear": "지우기",
	"components.input-date.errorMaxDateOnly": "날짜는 {maxDate} 또는 그 이전이어야 합니다",
	"components.input-date.errorMinDateOnly": "날짜는 {minDate} 또는 그 이후여야 합니다",
	"components.input-date.errorOutsideRange": "날짜는 {minDate}와 {maxDate} 사이여야 합니다.",
	"components.input-date.now": "현재",
	"components.input-date.openInstructions": "{format} 날짜 형식을 사용하십시오. 미니 달력에 접근하려면 아래쪽 화살표를 누르거나 Enter 키를 누르십시오.",
	"components.input-date.revert": "{label}이(가) 이전 값으로 돌아갔습니다.",
	"components.input-date.today": "오늘",
	"components.input-date.useDateFormat": "{format} 날짜 형식을 사용하십시오.",
	"components.input-date-range.endDate": "종료일",
	"components.input-date-range.errorBadInput": "{startLabel}은(는) {endLabel} 앞에 있어야 합니다",
	"components.input-date-range.interactive-label": "날짜 범위 입력",
	"components.input-date-range.startDate": "시작일",
	"components.input-date-time.date": "날짜",
	"components.input-date-time.errorMaxDateOnly": "날짜는 {maxDate} 또는 그 이전이어야 합니다",
	"components.input-date-time.errorMinDateOnly": "날짜는 {minDate} 또는 그 이후여야 합니다",
	"components.input-date-time.errorOutsideRange": "날짜는 {minDate}와 {maxDate} 사이여야 합니다.",
	"components.input-date-time.time": "시간",
	"components.input-date-time-range.endDate": "종료일",
	"components.input-date-time-range.errorBadInput": "{startLabel}은(는) {endLabel} 앞에 있어야 합니다",
	"components.input-date-time-range.interactive-label": "날짜 및 시간 범위 입력",
	"components.input-date-time-range.startDate": "시작일",
	"components.input-date-time-range-to.to": "~",
	"components.input-number.hintDecimalDuplicate": "이 숫자에 이미 소수점이 있습니다",
	"components.input-number.hintDecimalIncorrectComma": "소수점을 추가하려면 쉼표 “,” 문자를 사용합니다",
	"components.input-number.hintDecimalIncorrectPeriod": "소수점을 추가하려면 마침표 “.” 문자를 사용합니다",
	"components.input-number.hintInteger": "이 필드는 정수 값만 허용합니다(소수점 없음)",
	"components.input-search.clear": "검색 지우기",
	"components.input-search.defaultPlaceholder": "검색...",
	"components.input-search.search": "검색",
	"components.input-time-range.endTime": "종료 시각",
	"components.input-time-range.errorBadInput": "{startLabel}은(는) {endLabel} 앞에 있어야 합니다",
	"components.input-time-range.startTime": "시작 시각",
	"components.interactive.instructions": "Enter를 눌러 상호 작용하고 Esc를 눌러 종료합니다",
	"components.link.open-in-new-window": "새 창에서 열립니다.",
	"components.list.keyboard": "<b>화살표 키</b>를 사용하여 이 목록 내에서 포커스를 이동하거나 <b>페이지 업/다운</b>을 사용하여 위 또는 아래로 5개씩 이동합니다.",
	"components.list-controls.label": "목록에 대한 작업",
	"components.list-item.addItem": "항목 추가",
	"components.list-item-drag-handle.default": "{name}에 대한 항목 작업 재정렬",
	"components.list-item-drag-handle.keyboard": "전체 {size}에서 현재 위치 {currentPosition} 항목 재정렬 이 항목을 이동하라면 위쪽 또는 아래쪽 화살표를 누르십시오.",
	"components.list-item-drag-handle-tooltip.enter-desc": "키보드 재정렬 모드를 전환합니다.",
	"components.list-item-drag-handle-tooltip.enter-key": "입력",
	"components.list-item-drag-handle-tooltip.left-right-desc": "중첩 수준을 변경합니다.",
	"components.list-item-drag-handle-tooltip.left-right-key": "왼쪽/오른쪽",
	"components.list-item-drag-handle-tooltip.title": "재정렬을 위한 키보드 컨트롤:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "목록에서 항목을 위 또는 아래로 이동합니다.",
	"components.list-item-drag-handle-tooltip.up-down-key": "위로/아래로",
	"components.menu-item-return.return": "이전 메뉴로 돌아갑니다.",
	"components.menu-item-return.returnCurrentlyShowing": "이전 메뉴로 돌아갑니다. {menuTitle}을(를) 보고 있습니다.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x}/{y}",
	"components.meter-mixin.progressIndicator": "진도 표시기",
	"components.more-less.less": "축소",
	"components.more-less.more": "더 보기",
	"components.object-property-list.item-placeholder-text": "자리표시자 항목",
	"components.overflow-group.moreActions": "추가 작업",
	"components.pageable.info":
		`{count, plural,
			other {해당 항목 수 {countFormatted}개}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			other {{totalCountFormatted}개 항목 중 {countFormatted}개}
		}`,
	"components.pager-load-more.action": "더 많이 로드",
	"components.pager-load-more.action-with-page-size": "{count}개 더 로드",
	"components.pager-load-more.status-loading": "더 많은 항목 로드",
	"components.selection.action-max-hint":
		`{count, plural,
			other {{countFormatted}개 이상의 항목이 선택되면 비활성화됨}
		}`,
	"components.selection.action-required-hint": "이 작업을 수행할 항목을 선택하십시오",
	"components.selection.select-all": "모두 선택",
	"components.selection.select-all-items": "{count}개 항목을 모두 선택하십시오.",
	"components.selection.selected": "{count}개 선택됨",
	"components.selection.selected-plus": "{count}+개 선택됨",
	"components.selection-controls.label": "선택 작업",
	"components.sort.label": "정렬",
	"components.sort.text": "정렬: {selectedItemText}",
	"components.switch.conditions": "조건을 충족해야 합니다",
	"components.switch.hidden": "숨김",
	"components.switch.visible": "표시",
	"components.switch.visibleWithPeriod": "표시.",
	"components.table-col-sort-button.addSortOrder": "정렬 순서를 추가하려면 선택",
	"components.table-col-sort-button.changeSortOrder": "정렬 순서를 변경하려면 선택",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {최신에서 오래된 순으로 정렬됨}
				other {오래된 것에서 최신 순으로 정렬됨}
			}}
			numbers {{direction, select,
				desc {높은 것에서 낮은 순으로 정렬됨}
				other {낮은 것에서 높은 순으로 정렬됨}
			}}
			words {{direction, select,
				desc {Z에서 A 순으로 정렬됨}
				other {A에서 Z 순으로 정렬됨}
			}}
			value {{selectedMenuItemText} 정렬됨}
			other {{direction, select,
				desc {내림차순으로 정렬됨}
				other {오름차순으로 정렬됨}
			}}
		}`,
	"components.table-controls.label": "표에 대한 작업",
	"components.tabs.next": "앞으로 스크롤",
	"components.tabs.previous": "뒤로 스크롤",
	"components.tag-list.clear": "항목 {value}을(를) 제거하려면 클릭하거나, 백스페이스 또는 삭제 키를 누릅니다.",
	"components.tag-list.clear-all": "모두 지우기",
	"components.tag-list.cleared-all": "모든 태그 목록 항목을 제거했습니다",
	"components.tag-list.cleared-item": "태그 목록 항목 {value}을(를) 제거했습니다",
	"components.tag-list.interactive-label": "태그 목록, {count}개 항목",
	"components.tag-list.num-hidden": "{count}개 더",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {0개의 항목이 있는 태그 목록}
			other {{count}개의 항목이 있는 태그 목록}
		}`,
	"components.tag-list.show-less": "간단히 표시",
	"components.tag-list.show-more-description": "숨겨진 태그 목록 항목을 표시하려면 선택합니다",
	"components.tag-list-item.role-description": "태그",
	"components.tag-list-item.tooltip-arrow-keys": "화살표 키",
	"components.tag-list-item.tooltip-arrow-keys-desc": "태그 간에 이동합니다",
	"components.tag-list-item.tooltip-delete-key": "백스페이스/삭제",
	"components.tag-list-item.tooltip-delete-key-desc": "포커스된 태그를 삭제합니다",
	"components.tag-list-item.tooltip-title": "키보드 컨트롤",
	"templates.primary-secondary.divider": "보조 패널 디바이더",
	"templates.primary-secondary.secondary-panel": "보조 패널"
};
