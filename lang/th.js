export default {
	"components.alert.close": "ปิดการแจ้งเตือน",
	"components.breadcrumbs.breadcrumb": "แถบนำทาง",
	"components.button-add.addItem": "เพิ่มรายการ",
	"components.button-copy.copied": "คัดลอกแล้ว!",
	"components.button-copy.error": "การคัดลอกล้มเหลว ลองอีกครั้ง หรือลองคัดลอกด้วยตนเอง",
	"components.button-split.otherOptions": "ตัวเลือกอื่น",
	"components.calendar.hasEvents": "มีกิจกรรม",
	"components.calendar.notSelected": "ยังไม่ได้เลือก",
	"components.calendar.selected": "เลือกแล้ว",
	"components.calendar.show": "แสดง {month}",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "ปิดกล่องโต้ตอบนี้",
	"components.dialog.critical": "สำคัญ!",
	"components.dropdown.close": "ปิด",
	"components.filter.activeFilters": "ตัวกรองที่ใช้งาน:",
	"components.filter.additionalContentTooltip": "ใช้ <b>คีย์ลูกศรซ้าย/ขวา</b> เพื่อย้ายโฟกัสในรายการนี้",
	"components.filter.clear": "ล้าง",
	"components.filter.clearAll": "ล้างทั้งหมด",
	"components.filter.clearAllAnnounce": "กำลังล้างตัวกรองทั้งหมด",
	"components.filter.clearAllAnnounceOverride": "กำลังล้างตัวกรองทั้งหมดสำหรับ: {filterText}",
	"components.filter.clearAllDescription": "ล้างตัวกรองทั้งหมด",
	"components.filter.clearAllDescriptionOverride": "ล้างตัวกรองทั้งหมดสำหรับ: {filterText}",
	"components.filter.clearAnnounce": "ล้างตัวกรองสำหรับ: {filterName}",
	"components.filter.clearDescription": "ล้างตัวกรองสำหรับ: {filterName}",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {ไม่มีตัวกรองที่ถูกใช้}
			other {{number} ตัวกรองที่ถูกใช้}
		}`,
	"components.filter.filters": "ตัวกรอง",
	"components.filter.loading": "กำลังโหลดตัวกรอง",
	"components.filter.noFilters": "ไม่มีตัวกรองที่ใช้ได้",
	"components.filter.searchResults":
		`{number, plural,
			=0 {ไม่มีผลลัพธ์การค้นหา}
			other {{number} ผลลัพธ์การค้นหา}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText} ตัวกรองที่เลือกจะปรากฏก่อน",
	"components.filter.singleDimensionDescription": "กรองตาม: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {วันนี้}
			other {{num} วันที่ผ่านมา}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {ชั่วโมงที่แล้ว}
			other {{num} ชั่วโมงที่แล้ว}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "{num} เดือนที่ผ่านมา",
	"components.filter-dimension-set-date-time-range-value.label": "{text}  ขยายเพื่อเลือกวันที่",
	"components.filter-dimension-set-date-time-range-value.text": "ช่วงวันที่ที่กำหนดเอง",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} ถึง {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "ก่อน {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "หลัง {startValue}",
	"components.form-element.defaultError": "{label} ไม่ถูกต้อง",
	"components.form-element.defaultFieldLabel": "ฟิลด์",
	"components.form-element.input.email.typeMismatch": "อีเมลไม่ถูกต้อง",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {จำนวนต้องมากกว่า {min} และน้อยกว่า {max}}
				other {จำนวนต้องมากกว่า {min} และน้อยกว่าหรือเท่ากับ{max}}
			}}
			other {{maxExclusive, select,
				true {จำนวนต้องมากกว่าหรือเท่ากับ {min} และน้อยกว่า {max}}
				other {จำนวนต้องมากกว่าหรือเท่ากับ {min} และน้อยกว่าหรือเท่ากับ {max}}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {จำนวนต้องน้อยกว่า {max}}
			other {จำนวนต้องน้อยกว่าหรือเท่ากับ {max}}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {จำนวนต้องมากกว่า {min}}
			other {จำนวนต้องมากกว่าหรือเท่ากับ {min}}
		}`,
	"components.form-element.input.text.tooShort": "{label} ต้องมีอักขระอย่างน้อย {minlength} ตัว",
	"components.form-element.input.url.typeMismatch": "URL ไม่ถูกต้อง",
	"components.form-element.valueMissing": "{label} เป็นฟิลด์บังคับ",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			other {พบ {count} ข้อผิดพลาดในข้อมูลที่คุณส่ง}
		}`,
	"components.form-error-summary.text": "สลับรายละเอียดข้อผิดพลาด",
	"components.input-color.backgroundColor": "สีพื้นหลัง",
	"components.input-color.foregroundColor": "สีพื้นหน้า",
	"components.input-color.none": "ไม่มี",
	"components.input-date.clear": "ล้าง",
	"components.input-date.errorMaxDateOnly": "วันที่ต้องเป็นวันที่ก่อนหรือเท่ากับ {maxDate}",
	"components.input-date.errorMinDateOnly": "วันที่ต้องเป็นวันที่หรือหลัง {minDate}",
	"components.input-date.errorOutsideRange": "วันที่ต้องอยู่ระหว่าง {minDate} และ {maxDate}",
	"components.input-date.now": "ตอนนี้",
	"components.input-date.openInstructions": "ใช้รูปแบบวันที่ {format} ลูกศรลง หรือกด Enter เพื่อไปยังปฏิทินขนาดเล็ก",
	"components.input-date.revert": "{label} {label}เปลี่ยนกลับเป็นค่าก่อนหน้า",
	"components.input-date.today": "วันนี้",
	"components.input-date.useDateFormat": "ใช้รูปแบบวันที่ {format}",
	"components.input-date-range.endDate": "วันที่สิ้นสุด",
	"components.input-date-range.errorBadInput": "{startLabel} ต้องมาก่อน {endLabel}",
	"components.input-date-range.interactive-label": "การป้อนช่วงวันที่",
	"components.input-date-range.startDate": "วันที่เริ่มต้น",
	"components.input-date-time.date": "วันที่",
	"components.input-date-time.errorMaxDateOnly": "วันที่ต้องเป็นวันที่ก่อนหรือเท่ากับ {maxDate}",
	"components.input-date-time.errorMinDateOnly": "วันที่ต้องเป็นวันที่หรือหลัง {minDate}",
	"components.input-date-time.errorOutsideRange": "วันที่ต้องอยู่ระหว่าง {minDate} และ {maxDate}",
	"components.input-date-time.time": "เวลา",
	"components.input-date-time-range.endDate": "วันที่สิ้นสุด",
	"components.input-date-time-range.errorBadInput": "{startLabel} ต้องมาก่อน {endLabel}",
	"components.input-date-time-range.interactive-label": "การป้อนช่วงวันที่และเวลา",
	"components.input-date-time-range.startDate": "วันที่เริ่มต้น",
	"components.input-date-time-range-to.to": "ถึง",
	"components.input-number.hintDecimalDuplicate": "มีทศนิยมอยู่ในตัวเลขนี้แล้ว",
	"components.input-number.hintDecimalIncorrectComma": "หากต้องการเพิ่มทศนิยม ใช้อักขระเครื่องหมายจุลภาค “,”",
	"components.input-number.hintDecimalIncorrectPeriod": "หากต้องการเพิ่มทศนิยม ใช้อักขระเครื่องหมายจุด “.”",
	"components.input-number.hintInteger": "ฟิลด์นี้ยอมรับค่าจำนวนเต็มเท่านั้น (ไม่ใช้ทศนิยม)",
	"components.input-search.clear": "ล้างการค้นหา",
	"components.input-search.defaultPlaceholder": "ค้นหา...",
	"components.input-search.search": "ค้นหา",
	"components.input-time-range.endTime": "เวลาสิ้นสุด",
	"components.input-time-range.errorBadInput": "{startLabel} ต้องมาก่อน {endLabel}",
	"components.input-time-range.startTime": "เวลาเริ่มต้น",
	"components.interactive.instructions": "กด Enter เพื่อโต้ตอบ กด Escape เพื่อออก",
	"components.link.open-in-new-window": "เปิดในหน้าต่างใหม่",
	"components.list.keyboard": "ใช้ <b>คีย์ลูกศร</b> เพื่อย้ายโฟกัสในรายการนี้ หรือ <b>เลื่อนหน้าขึ้น/ลง</b> เพื่อย้ายขึ้นหรือลง 5 ลำดับ",
	"components.list-controls.label": "การดำเนินการสำหรับรายการ",
	"components.list-item.addItem": "เพิ่มรายการ",
	"components.list-item-drag-handle.default": "เรียงลำดับการดำเนินการใหม่สำหรับ {name}",
	"components.list-item-drag-handle.keyboard": "เรียงลำดับรายการใหม่ ตำแหน่งปัจจุบัน {currentPosition} จาก {size} หากต้องการย้ายรายการนี้ กดลูกศรขึ้นหรือลง",
	"components.list-item-drag-handle-tooltip.enter-desc": "สลับโหมดเรียงลำดับบนแป้นพิมพ์",
	"components.list-item-drag-handle-tooltip.enter-key": "ป้อน",
	"components.list-item-drag-handle-tooltip.left-right-desc": "เปลี่ยนระดับการซ้อน",
	"components.list-item-drag-handle-tooltip.left-right-key": "ซ้าย/ขวา",
	"components.list-item-drag-handle-tooltip.title": "การควบคุมแป้นพิมพ์สำหรับการเรียงลำดับใหม่:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "เลื่อนขึ้นหรือลงในรายการ",
	"components.list-item-drag-handle-tooltip.up-down-key": "ขึ้น/ลง",
	"components.menu-item-return.return": "กลับไปที่เมนูก่อนหน้า",
	"components.menu-item-return.returnCurrentlyShowing": "กลับไปที่เมนูก่อนหน้า คุณกำลังดู {menuTitle}",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}/{y}",
	"components.meter-mixin.fractionAria": "{x} จาก {y}",
	"components.meter-mixin.progressIndicator": "ตัวบ่งชี้ความก้าวหน้า",
	"components.more-less.less": "น้อยกว่า",
	"components.more-less.more": "เพิ่มเติม",
	"components.object-property-list.item-placeholder-text": "รายการตัวแทน",
	"components.overflow-group.moreActions": "การดำเนินการเพิ่มเติม",
	"components.pageable.info":
		`{count, plural,
			other {{countFormatted} รายการ}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			other {{countFormatted} จาก {totalCountFormatted} รายการ}
		}`,
	"components.pager-load-more.action": "โหลดเพิ่มเติม",
	"components.pager-load-more.action-with-page-size": "โหลดเพิ่ม {count} รายการ",
	"components.pager-load-more.status-loading": "กำลังโหลดรายการเพิ่มเติม",
	"components.scroll-wrapper.scroll-left": "เลื่อนไปทางซ้าย",
	"components.scroll-wrapper.scroll-right": "เลื่อนไปทางขวา",
	"components.selection.action-max-hint":
		`{count, plural,
			other {ปิดใช้งานเมื่อเลือกมากกว่า {countFormatted} รายการ}
		}`,
	"components.selection.action-required-hint": "เลือกรายการที่จะดำเนินการนี้",
	"components.selection.select-all": "เลือกทั้งหมด",
	"components.selection.select-all-items":
		`{count,plural,
	=1{เลือกรายการ} 
	one{เลือกทั้ง {countFormatted} รายการ} 
	other{เลือกทั้ง {countFormatted} รายการ}
	}`,
	"components.selection.selected": "{count} ที่เลือกแล้ว",
	"components.selection.selected-plus": "{count}+ ที่เลือกแล้ว",
	"components.selection-controls.label": "การดำเนินการสำหรับการเลือก",
	"components.sort.label": "เรียงลำดับ",
	"components.sort.text": "เรียงลำดับ: {selectedItemText}",
	"components.switch.conditions": "ต้องตรงตามเงื่อนไข",
	"components.switch.hidden": "ซ่อนอยู่",
	"components.switch.visible": "มองเห็นได้",
	"components.switch.visibleWithPeriod": "มองเห็นได้",
	"components.table-col-sort-button.addSortOrder": "เลือกเพื่อเพิ่มลำดับการเรียง",
	"components.table-col-sort-button.changeSortOrder": "เลือกเพื่อเปลี่ยนลำดับการเรียง",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {เรียงจากใหม่ไปเก่า}
				other {เรียงจากเก่าไปใหม่}
			}}
			numbers {{direction, select,
				desc {เรียงจากสูงไปต่ำ}
				other {เรียงจากต่ำไปสูง}
			}}
			words {{direction, select,
				desc {เรียงจาก Z ไป A}
				other {เรียงจาก A ไป Z}
			}}
			value {เรียงลำดับ {selectedMenuItemText}}
			other {{direction, select,
				desc {เรียงจากมากไปน้อย}
				other {เรียงจากน้อยไปมาก}
			}}
		}`,
	"components.table-controls.label": "การดำเนินการสำหรับตาราง",
	"components.tabs.next": "เลื่อนไปข้างหน้า",
	"components.tabs.previous": "เลื่อนย้อนกลับ",
	"components.tag-list.clear": "คลิก กด backspace หรือกดคีย์ delete เพื่อลบรายการ {value}",
	"components.tag-list.clear-all": "ล้างทั้งหมด",
	"components.tag-list.cleared-all": "ลบรายการแท็กทั้งหมด",
	"components.tag-list.cleared-item": "ลบรายการแท็ก {value} แล้ว",
	"components.tag-list.interactive-label": "รายการแท็ก {count} รายการ",
	"components.tag-list.num-hidden": "+ อีก {count} รายการ",
	"components.tag-list.role-description":
		`{count,plural,
	=0 {แท็กรายการที่มี 0 รายการ} 
	one {แท็กรายการที่มี {count} รายการ} 
	other {แท็กรายการที่มี {count} รายการ}}`,
	"components.tag-list.show-less": "แสดงน้อยลง",
	"components.tag-list.show-more-description": "เลือกเพื่อแสดงรายการแท็กที่ซ่อนอยู่",
	"components.tag-list-item.role-description": "แท็ก",
	"components.tag-list-item.tooltip-arrow-keys": "คีย์ลูกศร",
	"components.tag-list-item.tooltip-arrow-keys-desc": "ย้ายระหว่างแท็ก",
	"components.tag-list-item.tooltip-delete-key": "Backspace/Delete",
	"components.tag-list-item.tooltip-delete-key-desc": "ลบแท็กที่โฟกัส",
	"components.tag-list-item.tooltip-title": "การควบคุมแป้นพิมพ์",
	"templates.primary-secondary.divider": "ตัวแบ่งบานหน้าต่างรอง",
	"templates.primary-secondary.secondary-panel": "บานหน้าต่างรอง"
};
