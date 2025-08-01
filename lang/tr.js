export default {
	"components.alert.close": "Kapatma Uyarısı",
	"components.breadcrumbs.breadcrumb": "İçerik Haritası",
	"components.button-add.addItem": "Öğe Ekle",
	"components.button-split.otherOptions": "Diğer Seçenekler",
	"components.calendar.hasEvents": "Olayları Var.",
	"components.calendar.notSelected": "Seçili Değil.",
	"components.calendar.selected": "Seçili.",
	"components.calendar.show": "{month} Göster",
	"components.count-badge.plus": "{number}+",
	"components.dialog.close": "Bu iletişim kutusunu kapat",
	"components.dialog.critical": "Kritik!",
	"components.dropdown.close": "Kapat",
	"components.filter.activeFilters": "Etkin Filtreler:",
	"components.filter.additionalContentTooltip": "Odağı bu liste öğesi içinde taşımak için <b>sol/sağ ok tuşlarını</b> kullanın",
	"components.filter.clear": "Temizle",
	"components.filter.clearAll": "Tümünü Temizle",
	"components.filter.clearAllAnnounce": "Tüm filtreler temizleniyor",
	"components.filter.clearAllAnnounceOverride": "{filterText} için tüm filtreleri temizleniyor",
	"components.filter.clearAllDescription": "Tüm filtreleri temizle",
	"components.filter.clearAllDescriptionOverride": "{filterText} için tüm filtreleri temizle",
	"components.filter.clearAnnounce": "{filterName} için filtreler temizleniyor",
	"components.filter.clearDescription": "{filterName} için filtreleri temizle",
	"components.filter.filterCountDescription":
		`{number, plural,
			=0 {Filtre uygulanmadı.}
			one {{number} filtre uygulandı.}
			other {{number} filtre uygulandı.}
		}`,
	"components.filter.filters": "Filtre",
	"components.filter.loading": "Filtreler yükleniyor",
	"components.filter.noFilters": "Uygun filtre yok",
	"components.filter.searchResults":
		`{number, plural,
			=0 {Arama sonucu yok}
			one {{number} arama sonucu}
			other {{number} arama sonucu}
		}`,
	"components.filter.selectedFirstListLabel": "{headerText}. Seçilen filtreler önce görünür.",
	"components.filter.singleDimensionDescription": "Filtreleme ölçütü: {filterName}",
	"components.filter-dimension-set-date-text-value.textDays":
		`{num, plural,
			=0 {Bugün}
			one {Son {num} gün}
			other {Son {num} gün}
		}`,
	"components.filter-dimension-set-date-text-value.textHours":
		`{num, plural,
			=1 {Son saat}
			other {Son {num} saat}
		}`,
	"components.filter-dimension-set-date-text-value.textMonths": "Son {num} ay",
	"components.filter-dimension-set-date-time-range-value.label": "{text}, tarihleri seçmek için genişletin",
	"components.filter-dimension-set-date-time-range-value.text": "Özel tarih aralığı",
	"components.filter-dimension-set-date-time-range-value.valueTextRange": "{startValue} - {endValue}",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeEndOnly": "{endValue} tarihinden önce",
	"components.filter-dimension-set-date-time-range-value.valueTextRangeStartOnly": "{startValue} tarihinden sonra",
	"components.form-element.defaultError": "{label} geçersiz",
	"components.form-element.defaultFieldLabel": "Alan",
	"components.form-element.input.email.typeMismatch": "E-posta geçerli değil",
	"components.form-element.input.number.rangeError":
		`{minExclusive, select,
			true {{maxExclusive, select,
				true {Sayı {min} değerinden büyük ve {max} değerinden küçük olmalıdır.}
				other {Sayı {min} değerinden büyük ve {max} değerinden küçük veya bu değere eşit olmalıdır.}
			}}
			other {{maxExclusive, select,
				true {Sayı {min} değerinden büyük veya bu değere eşit olmalıdır ve {max} değerinden küçük olmalıdır.}
				other {Sayı {min} değerinden büyük veya bu değere eşit olmalıdır ve {max} değerinden küçük veya bu değere eşit olmalıdır.}
			}}
		}`,
	"components.form-element.input.number.rangeOverflow":
		`{maxExclusive, select,
			true {Sayı {max} değerinden küçük olmalıdır.}
			other {Sayı {max} değerinden küçük veya bu değere eşit olmalıdır.}
		}`,
	"components.form-element.input.number.rangeUnderflow":
		`{minExclusive, select,
			true {Sayı {min} değerinden büyük olmalıdır.}
			other {Sayı {min} değerinden büyük veya bu değere eşit olmalıdır.}
		}`,
	"components.form-element.input.text.tooShort": "{label} en az {minlength} karakter olmalıdır",
	"components.form-element.input.url.typeMismatch": "URL geçerli değil",
	"components.form-element.valueMissing": "{label} zorunludur",
	"components.form-error-summary.errorSummary":
		`{count, plural,
			one {Gönderdiğiniz bilgilerde {count} hata bulundu}
			other {Gönderdiğiniz bilgilerde {count} hata bulundu}
		}`,
	"components.form-error-summary.text": "Hata ayrıntılarını değiştir",
	"components.input-color.backgroundColor": "Arka Plan Rengi",
	"components.input-color.foregroundColor": "Ön Plan Rengi",
	"components.input-color.none": "Yok",
	"components.input-date.clear": "Temizle",
	"components.input-date.errorMaxDateOnly": "Tarih, {maxDate} veya önceki bir tarih olmalıdır",
	"components.input-date.errorMinDateOnly": "Tarih, {minDate} veya sonraki bir tarih olmalıdır",
	"components.input-date.errorOutsideRange": "Tarih, {minDate} ile {maxDate} arasında olmalıdır",
	"components.input-date.now": "Şimdi",
	"components.input-date.openInstructions": "{format} tarih formatını kullanın. Küçük takvime erişmek için aşağı okunu kullanın veya enter tuşuna basın.",
	"components.input-date.revert": "{label} önceki değere geri döndü.",
	"components.input-date.today": "Bugün",
	"components.input-date.useDateFormat": "{format} tarih formatını kullanın.",
	"components.input-date-range.endDate": "Bitiş Tarihi",
	"components.input-date-range.errorBadInput": "{startLabel}, {endLabel} tarihinden önce olmalıdır",
	"components.input-date-range.interactive-label": "Tarih aralığı girişi",
	"components.input-date-range.startDate": "Başlangıç Tarihi",
	"components.input-date-time.date": "Tarih",
	"components.input-date-time.errorMaxDateOnly": "Tarih, {maxDate} veya önceki bir tarih olmalıdır",
	"components.input-date-time.errorMinDateOnly": "Tarih, {minDate} veya sonraki bir tarih olmalıdır",
	"components.input-date-time.errorOutsideRange": "Tarih, {minDate} ile {maxDate} arasında olmalıdır",
	"components.input-date-time.time": "Saat",
	"components.input-date-time-range.endDate": "Bitiş Tarihi",
	"components.input-date-time-range.errorBadInput": "{startLabel}, {endLabel} tarihinden önce olmalıdır",
	"components.input-date-time-range.interactive-label": "Tarih ve saat aralığı girişi",
	"components.input-date-time-range.startDate": "Başlangıç Tarihi",
	"components.input-date-time-range-to.to": "Kime",
	"components.input-number.hintDecimalDuplicate": "Bu sayıda zaten bir ondalık var",
	"components.input-number.hintDecimalIncorrectComma": "Ondalık sayı eklemek için virgül “,” karakterini kullanın",
	"components.input-number.hintDecimalIncorrectPeriod": "Ondalık sayı eklemek için nokta “.” karakterini kullanın",
	"components.input-number.hintInteger": "Bu alanda yalnızca tam sayı değerleri kabul edilir (ondalık sayı kabul edilmez)",
	"components.input-search.clear": "Aramayı Temizle",
	"components.input-search.defaultPlaceholder": "Ara...",
	"components.input-search.search": "Arama",
	"components.input-time-range.endTime": "Bitiş Saati",
	"components.input-time-range.errorBadInput": "{startLabel}, {endLabel} tarihinden önce olmalıdır",
	"components.input-time-range.startTime": "Başlangıç Saati",
	"components.interactive.instructions": "Etkileşim kurmak için Enter tuşuna, çıkmak için Escape tuşuna basın",
	"components.link.open-in-new-window": "Yeni bir pencerede açılır.",
	"components.list.keyboard": "Odağı bu listenin içine taşımak için <b>ok tuşlarını</b>, beşer beşer yukarı veya aşağı gitmek için ise <b>sayfa yukarı/aşağı</b> tuşlarını kullanın",
	"components.list-controls.label": "Liste için eylemler",
	"components.list-item.addItem": "Öğe Ekle",
	"components.list-item-drag-handle.default": "{name} için öğe eylemini yeniden sırala",
	"components.list-item-drag-handle.keyboard": "Öğeyi yeniden sırala, mevcut konum {currentPosition} / {size}. Bu öğeyi taşımak için yukarı veya aşağı oklara basın.",
	"components.list-item-drag-handle-tooltip.enter-desc": "Klavye yeniden sıralama modunu değiştirin.",
	"components.list-item-drag-handle-tooltip.enter-key": "Gir",
	"components.list-item-drag-handle-tooltip.left-right-desc": "İç içe geçme seviyesini değiştirin.",
	"components.list-item-drag-handle-tooltip.left-right-key": "Sol/Sağ",
	"components.list-item-drag-handle-tooltip.title": "Yeniden Sıralama için Klavye Kontrolleri:",
	"components.list-item-drag-handle-tooltip.up-down-desc": "Öğeyi listede yukarı veya aşağı taşıyın.",
	"components.list-item-drag-handle-tooltip.up-down-key": "Yukarı/Aşağı",
	"components.menu-item-return.return": "Önceki menüye dönün.",
	"components.menu-item-return.returnCurrentlyShowing": "Önceki menüye dönün. {menuTitle} başlığını görüntülüyorsunuz.",
	"components.meter-mixin.commaSeperatedAria": "{term1}, {term2}",
	"components.meter-mixin.fraction": "{x}∕{y}",
	"components.meter-mixin.fractionAria": "{x} out of {y}",
	"components.meter-mixin.progressIndicator": "Gelişim Göstergesi",
	"components.more-less.less": "daha az",
	"components.more-less.more": "daha fazla",
	"components.object-property-list.item-placeholder-text": "Yer Tutucu Öğesi",
	"components.overflow-group.moreActions": "Daha Fazla Eylem",
	"components.pageable.info":
		`{count, plural,
			one {{countFormatted} öğe}
			other {{countFormatted} öğe}
		}`,
	"components.pageable.info-with-total":
		`{totalCount, plural,
			one {{countFormatted} / {totalCountFormatted} öğe}
			other {{countFormatted} / {totalCountFormatted} öğe}
		}`,
	"components.pager-load-more.action": "Daha Fazla Yükle",
	"components.pager-load-more.action-with-page-size": "{count} Tane Daha Yükle",
	"components.pager-load-more.status-loading": "Daha fazla öğe yükleniyor",
	"components.selection.action-max-hint":
		`{count, plural,
			one {{countFormatted} öğeden fazlası seçildiğinde devre dışı bırakılır}
			other {{countFormatted} öğeden fazlası seçildiğinde devre dışı bırakılır}
		}`,
	"components.selection.action-required-hint": "Bu eylemi gerçekleştirebilmek için bir öğe seçin",
	"components.selection.select-all": "Tümünü Seç",
	"components.selection.select-all-items": "{count} Öğenin Tamamını Seç",
	"components.selection.selected": "{count} öğe seçildi",
	"components.selection.selected-plus": "{count}+ öğe seçildi",
	"components.selection-controls.label": "Seçim için eylemler",
	"components.sort.label": "Sırala",
	"components.sort.text": "Sırala: {selectedItemText}",
	"components.switch.conditions": "Koşullar karşılanmalıdır",
	"components.switch.hidden": "Gizli",
	"components.switch.visible": "Görünür",
	"components.switch.visibleWithPeriod": "Görünür.",
	"components.table-col-sort-button.addSortOrder": "Sıralama düzeni eklemek için seçin",
	"components.table-col-sort-button.changeSortOrder": "Sıralama düzenini değiştirmek için seçin",
	"components.table-col-sort-button.title":
		`{sourceType, select,
			dates {{direction, select,
				desc {Yeniden eskiye sıralandı}
				other {Eskiden yeniye sıralandı}
			}}
			numbers {{direction, select,
				desc {Yüksekten düşüğe sıralandı}
				other {Düşükten yükseğe sıralandı}
			}}
			words {{direction, select,
				desc {Z’den A’ya sıralandı}
				other {A’dan Z’ye sıralandı}
			}}
			value {{selectedMenuItemText} sıralandı}
			other {{direction, select,
				desc {Azalan şekilde sıralandı}
				other {Artan şekilde sıralandı}
			}}
		}`,
	"components.table-controls.label": "Tablo için eylemler",
	"components.tabs.next": "İleri Kaydır",
	"components.tabs.previous": "Geri Kaydır",
	"components.tag-list.clear": "Öğe {value} değerini kaldırmak için tıklatın, geri al tuşuna veya sil tuşuna basın",
	"components.tag-list.clear-all": "Tümünü Temizle",
	"components.tag-list.cleared-all": "Tüm etiket listesi öğeleri kaldırıldı",
	"components.tag-list.cleared-item": "Kaldırılan etiket listesi öğesi {value}",
	"components.tag-list.interactive-label": "Etiket Listesi, {count} öğe",
	"components.tag-list.num-hidden": "+{count} tane daha",
	"components.tag-list.role-description":
		`{count, plural,
			=0 {0 öğeli Etiket Listesi}
			one {{count} öğeli Etiket Listesi}
			other {{count} öğeli Etiket Listesi}
		}`,
	"components.tag-list.show-less": "Daha Azını Göster",
	"components.tag-list.show-more-description": "Gizli etiket listesi öğelerini göstermek için seçin",
	"components.tag-list-item.role-description": "Etiket",
	"components.tag-list-item.tooltip-arrow-keys": "Ok Tuşları",
	"components.tag-list-item.tooltip-arrow-keys-desc": "Etiketler arasında gezinme",
	"components.tag-list-item.tooltip-delete-key": "Geri Al/Sil",
	"components.tag-list-item.tooltip-delete-key-desc": "Odaklanılan etiketi sil",
	"components.tag-list-item.tooltip-title": "Klavye Kontrolleri",
	"templates.primary-secondary.divider": "İkincil panel ayırıcı",
	"templates.primary-secondary.secondary-panel": "İkincil panel"
};
