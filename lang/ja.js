export default {
	"components.alert.close": "アラートを閉じる",
	"components.breadcrumbs.breadcrumb": "階層",
	"components.button-add.addItem": "項目の追加",
	"components.button-split.otherOptions": "その他のオプション",
	"components.calendar.hasEvents": "イベントがあります。",
	"components.calendar.notSelected": "選択されていません。",
	"components.calendar.selected": "選択されています。",
	"components.calendar.show": "{month} を表示",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "このダイアログを閉じる",
	"components.dialog.critical": "重大です！",
	"components.dropdown.close": "閉じる",
	"components.filter.activeFilters": "アクティブフィルタ:",
	"components.filter.additionalContentTooltip": "<b>の左/右矢印キー</b>を使用して、このリスト項目内にフォーカスを移動します",
	"components.filter.clear": "クリア",
	"components.filter.clearAll": "すべてをクリア",
	"components.filter.clearAllAnnounce": "すべてのフィルタのクリア",
	"components.filter.clearAllAnnounceOverride": "{filterText} のすべてのフィルタのクリア",
	"components.filter.clearAllDescription": "すべてのフィルターをクリア",
	"components.filter.clearAllDescriptionOverride": "{filterText} のすべてのフィルタをクリア",
	"components.filter.clearAnnounce": "{filterName} フィルタのクリア",
	"components.filter.clearDescription": "{filterName} フィルタのクリア",
	"components.filter.loading": "フィルタのロード中",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {フィルタは適用されていません。}
			other {{number} 個のフィルタが適用されています。}
		}`,
	"components.filter.filters": "フィルタ",
	"components.filter.noFilters": "使用可能なフィルタはありません",
	"components.filter.searchResults":
		`{number, plural,
			=0 {検索結果なし}
			other {{number} 件の検索結果}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}。選択したフィルタが最初に表示されます。",
	"components.filter.singleDimensionDescription": "フィルタ条件: {filterName}",
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			other {過去 {num} 時間}
		}`,
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {今日}
			other {過去 {num} 日間}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "過去 {num} ヵ月",
	"components.filter-dimension-set-date-time-range-value.label": "{text}、展開して日付を選択",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} から {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "{startValue} の後",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "{endValue} より前",
	"components.filter-dimension-set-date-time-range-value.text": "カスタム日付範囲",
	"components.form-element.defaultError": "{label} は無効です",
	"components.form-element.defaultFieldLabel": "フィールド",
	"components.form-element.input.email.typeMismatch": "電子メールが無効です",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {数値は {min} より大きく {max} 未満である必要があります。}
				other {数値は {min} より大きく {max} 以下である必要があります。}
			}}
			other {{maxExclusive, select,
				true {数値は {min} 以上 {max} 未満である必要があります。}
				other {数値は {min} 以上 {max} 以下である必要があります。}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {数値は {max} 未満である必要があります。}
			other {数値は {max} 以下である必要があります。}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {数値は {min} より大きい必要があります。}
			other {数値は {min} 以上である必要があります。}
		}`,
	"components.form-element.input.text.tooShort": "{label} は {minlength} 文字以上である必要があります",
	"components.form-element.input.url.typeMismatch": "URL が有効ではありません",
	"components.form-element.valueMissing": "{label} は必須です",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			other {送信した情報に {count} 件のエラーが見つかりました}
		}`,
	"components.form-error-summary.text": "エラーの詳細を切り替え",
	"components.input-color.backgroundColor": "背景色",
	"components.input-color.foregroundColor": "前景色",
	"components.input-color.none": "なし",
	"components.input-date-range.endDate": "終了日",
	"components.input-date-range.errorBadInput": "{startLabel} は {endLabel} より前にする必要があります",
	"components.input-date-range.interactive-label": "日付範囲の入力",
	"components.input-date-range.startDate": "開始日",
	"components.input-date-time-range-to.to": "～",
	"components.input-date-time-range.endDate": "終了日",
	"components.input-date-time-range.errorBadInput": "{startLabel} は {endLabel} より前にする必要があります",
	"components.input-date-time-range.startDate": "開始日",
	"components.input-date-time.date": "日付",
	"components.input-date-time.errorMaxDateOnly": "日付は {maxDate} 以前にする必要があります",
	"components.input-date-time.errorMinDateOnly": "日付は {minDate} 以降にする必要があります",
	"components.input-date-time.errorOutsideRange": "日付は {minDate} から {maxDate} の間にする必要があります",
	"components.input-date-time.time": "時刻",
	"components.input-date-time-range.interactive-label": "日付と時刻の範囲の入力",
	"components.input-date.clear": "クリア",
	"components.input-date.errorMaxDateOnly": "日付は {maxDate} 以前にする必要があります",
	"components.input-date.errorMinDateOnly": "日付は {minDate} 以降にする必要があります",
	"components.input-date.errorOutsideRange": "日付は {minDate} から {maxDate} の間にする必要があります",
	"components.input-date.openInstructions": "日付形式 {format} を使用します。ミニカレンダーにアクセスするには下矢印を使うか Enter を押します。",
	"components.input-date.now": "現在",
	"components.input-date.revert": "{label} が前の値に戻されました。",
	"components.input-date.today": "今日",
	"components.input-date.useDateFormat": "日付形式 {format} を使用します。",
	"components.input-number.hintInteger": "このフィールドには整数値のみ入力できます（小数不可）。",
	"components.input-number.hintDecimalDuplicate": "この数値にはすでに小数があります",
	"components.input-number.hintDecimalIncorrectComma": "小数を追加するには、カンマ「,」文字を使用します",
	"components.input-number.hintDecimalIncorrectPeriod": "小数を追加するには、ピリオド「.」文字を使用します",
	"components.input-search.clear": "検索のクリア",
	"components.input-search.defaultPlaceholder": "検索...",
	"components.input-search.search": "検索",
	"components.input-time-range.endTime": "終了時刻",
	"components.input-time-range.errorBadInput": "{startLabel} は {endLabel} より前にする必要があります",
	"components.input-time-range.startTime": "開始時刻",
	"components.interactive.instructions": "対話を始めるには Enter キー、終了するには Esc キーを押します",
	"components.link.open-in-new-window": "新規ウィンドウで開きます。",
	"components.list.keyboard": "<b>方向キー</b>を使用して、このリスト内のフォーカスを移動するか、<b>page up/down</b> キーを使用して上下に 5 つずつ移動します",
	"components.list-controls.label": "リストのアクション",
	"components.list-item.addItem": "項目の追加",
	"components.list-item-drag-handle.default": "{name} の項目並べ替えアクション",
	"components.list-item-drag-handle.keyboard": "項目の並べ替え、現在の位置 {currentPosition}、サイズ {size}。この項目を移動するには、上矢印または下矢印を押します。",
	"components.list-item-drag-handle-tooltip.title": "並べ替え用のキーボードコントロール:",
	"components.list-item-drag-handle-tooltip.enter-key": "入力",
	"components.list-item-drag-handle-tooltip.enter-desc": "キーボードの並べ替えモードを切り替えます。",
	"components.list-item-drag-handle-tooltip.up-down-key": "上/下",
	"components.list-item-drag-handle-tooltip.up-down-desc": "リスト内で項目を上下に移動します。",
	"components.list-item-drag-handle-tooltip.left-right-key": "左/右",
	"components.list-item-drag-handle-tooltip.left-right-desc": "ネストレベルを変更します。",
	"components.menu-item-return.return": "前のメニューに戻ります。",
	"components.menu-item-return.returnCurrentlyShowing": "前のメニューに戻ります。{menuTitle} を表示しています。",
	"components.meter-mixin.commaSeperatedAria": "{term1}、{term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x}/{y}",
	"components.meter-mixin.progressIndicator": "進捗状況インジケータ",
	"components.more-less.less": "減らす",
	"components.more-less.more": "増やす",
	"components.object-property-list.item-placeholder-text": "プレースホルダの項目",
	"components.overflow-group.moreActions": "その他のアクション",
	"components.pager-load-more.action": "さらに読み込む",
	"components.pager-load-more.action-with-page-size": "さらに {count} 件を読み込む",
	"components.pageable.info":
		`{count, plural,
			other {{countFormatted} 個の項目}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			other {{countFormatted}/{totalCountFormatted} 個の項目}
		}`,
	"components.pager-load-more.status-loading": "さらに項目を読み込み中",
	"components.selection.action-max-hint":
		`{count, plural,
			other {{countFormatted} 個を超える項目が選択されている場合は無効になります}
		}`,
	"components.selection.action-required-hint": "この操作を実行するための項目を選択します",
	"components.selection.select-all": "すべて選択",
	"components.selection.select-all-items": "{count} 個の項目をすべて選択",
	"components.selection.selected": "{count} 個を選択済み",
	"components.selection.selected-plus": "{count} 個以上を選択済み",
	"components.selection-controls.label": "選択のアクション",
	"components.switch.visible": "表示",
	"components.switch.visibleWithPeriod": "表示。",
	"components.switch.hidden": "非表示",
	"components.switch.conditions": "条件が一致する必要があります",
	"components.table-col-sort-button.addSortOrder": "選択して並べ替え順序を追加",
	"components.table-col-sort-button.changeSortOrder": "選択して並べ替え順序を変更",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {新から旧へ並べ替え}
				other {旧から新へ並べ替え}
			}}
			numbers {{direction, select,
				desc {高から低へ並べ替え}
				other {低から高へ並べ替え}
			}}
			words {{direction, select,
				desc {降順に並べ替え}
				other {昇順に並べ替え}
			}}
			value {並べ替え {selectedMenuItemText}}
			other {{direction, select,
				desc {降順に並べ替え}
				other {昇順に並べ替え}
			}}
		}`,
	"components.table-controls.label": "テーブルのアクション",
	"components.tabs.next": "前方にスクロール",
	"components.tabs.previous": "後方にスクロール",
	"components.tag-list.clear": "クリックする、Backspace キーを押す、または Delete キーを押すと項目 {value} が削除されます",
	"components.tag-list.clear-all": "すべてをクリア",
	"components.tag-list.cleared-all": "すべてのタグリスト項目を削除しました",
	"components.tag-list.cleared-item": "タグリスト項目 {value} を削除しました",
	"components.tag-list.interactive-label": "タグリスト、{count} 項目",
	"components.tag-list.num-hidden": "+ {count} 件追加",
	"components.tag-list.role-description": "タグリスト",
	"components.tag-list.show-less": "少なく表示",
	"components.tag-list.show-more-description": "選択すると、非表示のタグリスト項目が表示されます",
	"components.tag-list-item.role-description": "タグ",
	"components.tag-list-item.tooltip-arrow-keys": "矢印キー",
	"components.tag-list-item.tooltip-arrow-keys-desc": "タグ間を移動します",
	"components.tag-list-item.tooltip-delete-key": "Backspace キー／Delete キー",
	"components.tag-list-item.tooltip-delete-key-desc": "フォーカスされたタグを削除します",
	"components.tag-list-item.tooltip-title": "キーボードコントロール",
	"templates.primary-secondary.divider": "セカンダリパネルディバイダ",
	"templates.primary-secondary.secondary-panel": "セカンダリパネル"
};
