export const listDemos = {
	imgPrimaryAndSupporting: [{
		key: '1',
		primaryText: 'Introductory Earth Sciences',
		supportingText: 'This course explores the geological processes of the Earth\'s interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering.',
		imgSrc: 'https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg',
		dropNested: true,
		items: [{
			key: '1-1',
			primaryText: 'Glaciation',
			supportingText: 'Nesting Allowed',
			imgSrc: 'https://s.brightspace.com/course-images/images/bf648978-6637-4fdc-815b-81572c436c0e/tile-high-density-max-size.jpg',
			dropNested: true,
			items: []
		}, {
			key: '1-2',
			primaryText: 'Weathering',
			supportingText: 'Nesting Allowed',
			imgSrc: 'https://s.brightspace.com/course-images/images/50f91ba6-7c25-482a-bd71-1c4b7c8d2154/tile-high-density-min-size.jpg',
			dropNested: true,
			items: []
		}, {
			key: '1-3',
			primaryText: 'Volcanism',
			supportingText: 'Nesting Allowed',
			imgSrc: 'https://s.brightspace.com/course-images/images/5eb2371d-6099-4c8d-8aad-075f357012a2/tile-high-density-min-size.jpg',
			dropNested: true,
			items: []
		}]
	}, {
		key: '2',
		primaryText: 'Applied Wetland Science',
		supportingText: 'Advanced concepts on wetland ecosystems in the context of regional and global earth systems processes such as carbon and nitrogen cycling and climate change, applications of wetland paleoecology, use of isotopes and other geochemical tools in wetland science, and wetland engineering in landscape rehabilitation and ecotechnology.',
		imgSrc: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg',
		items: [{
			key: '-1',
			primaryText: 'Carbon & Nitrogen Cycling',
			supportingText: 'Nesting Allowed',
			imgSrc: 'https://s.brightspace.com/course-images/images/623b420b-a305-4762-8af8-598f0e72e956/tile-high-density-min-size.jpg',
			dropNested: true,
			items: []
		}, {
			key: '2-2',
			primaryText: 'Wetland Engineering',
			supportingText: 'Nesting Allowed',
			imgSrc: 'https://s.brightspace.com/course-images/images/26102577-8f2a-4e24-84b5-19d76decbc7a/tile-high-density-min-size.jpg',
			dropNested: true,
			items: []
		}]
	}],
	primaryAndSupportingText: [{
		key: '1',
		primaryText: 'Introductory Earth Sciences',
		supportingText: 'This course explores the geological processes of the Earth\'s interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering.',
		dropNested: true,
		items: [{
			key: '1-1',
			primaryText: 'Glaciation',
			supportingText: 'Nesting Allowed',
			dropNested: true,
			items: []
		}, {
			key: '1-2',
			primaryText: 'Weathering',
			supportingText: 'Nesting Allowed',
			dropNested: true,
			items: []
		}, {
			key: '1-3',
			primaryText: 'Volcanism',
			supportingText: 'Nesting Allowed',
			dropNested: true,
			items: []
		}]
	}, {
		key: '2',
		primaryText: 'Applied Wetland Science',
		supportingText: 'Advanced concepts on wetland ecosystems in the context of regional and global earth systems processes such as carbon and nitrogen cycling and climate change, applications of wetland paleoecology, use of isotopes and other geochemical tools in wetland science, and wetland engineering in landscape rehabilitation and ecotechnology.',
		items: [{
			key: '2-1',
			primaryText: 'Carbon & Nitrogen Cycling',
			supportingText: 'Nesting Allowed',
			dropNested: true,
			items: []
		}, {
			key: '2-2',
			primaryText: 'Wetland Engineering',
			supportingText: 'Nesting Allowed',
			dropNested: true,
			items: []
		}]
	}],
	primaryTextOnly: [{
		key: '1',
		primaryText: 'Introductory Earth Sciences',
		dropNested: true,
		items: [{
			key: '1-1',
			primaryText: 'Glaciation',
			dropNested: true,
			items: []
		}, {
			key: '1-2',
			primaryText: 'Weathering',
			dropNested: true,
			items: []
		}, {
			key: '1-3',
			primaryText: 'Volcanism',
			dropNested: true,
			items: []
		}]
	}, {
		key: '2',
		primaryText: 'Applied Wetland Science',
		items: [{
			key: '2-1',
			primaryText: 'Carbon & Nitrogen Cycling',
			dropNested: true,
			items: []
		}, {
			key: '2-2',
			primaryText: 'Wetland Engineering',
			dropNested: true,
			items: []
		}]
	}],
	primaryTextOnlyDeepNesting: [{
		key: '1',
		primaryText: 'Item 1 - Deeply Nested',
		dropNested: true,
		items: [{
			key: '1-1',
			primaryText: 'Glaciation',
			dropNested: true,
			items: [{
				key: '1-1-1',
				primaryText: 'Ice',
				dropNested: true,
				items: [{
					key: '1-1-1-1',
					primaryText: 'Cold',
					dropNested: true,
					items: [{
						key: '1-1-1-1-1',
						primaryText: 'Winter',
						dropNested: true,
						items: [{
							key: '1-1-1-1-1-1',
							primaryText: 'Canada',
							dropNested: true,
							items: [{
								key: '1-1-1-1-1-1-1',
								primaryText: 'Moose',
								dropNested: true,
								items: []
							}]
						}]
					}]
				}]
			}, {
				key: '1-1-2',
				primaryText: 'Snow',
				dropNested: true,
				items: []
			}]
		}, {
			key: '1-2',
			primaryText: 'Weathering',
			dropNested: true,
			items: []
		}, {
			key: '1-3',
			primaryText: 'Volcanism',
			dropNested: true,
			items: []
		}]
	}, {
		key: '2',
		primaryText: 'Item 2',
		items: [{
			key: '2-1',
			primaryText: '2-1',
			dropNested: true,
			items: []
		}, {
			key: '2-2',
			primaryText: '2-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '3',
		primaryText: 'Item 3',
		items: [{
			key: '3-1',
			primaryText: '3-1',
			dropNested: true,
			items: []
		}, {
			key: '3-2',
			primaryText: '3-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '4',
		primaryText: 'Item 4',
		items: [{
			key: '4-1',
			primaryText: '4-1',
			dropNested: true,
			items: []
		}, {
			key: '4-2',
			primaryText: '4-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '5',
		primaryText: 'Item 5',
		items: [{
			key: '5-1',
			primaryText: '5-1',
			dropNested: true,
			items: []
		}, {
			key: '5-2',
			primaryText: '5-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '6',
		primaryText: 'Item 6',
		items:[{
			key: '6-1',
			primaryText: '6-1',
			dropNested: true,
			items: []
		}, {
			key: '6-2',
			primaryText: '6-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '7',
		primaryText: 'Item 7',
		items: [{
			key: '7-1',
			primaryText: '7-1',
			dropNested: true,
			items: []
		}, {
			key: '7-2',
			primaryText: '7-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '8',
		primaryText: 'Item 8',
		items: [{
			key: '8-1',
			primaryText: '8-1',
			dropNested: true,
			items: []
		}, {
			key: '8-2',
			primaryText: '8-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '9',
		primaryText: 'Item 9',
		items: [{
			key: '9-1',
			primaryText: '9-1',
			dropNested: true,
			items: []
		}, {
			key: '9-2',
			primaryText: '9-2',
			dropNested: true,
			items: []
		}]
	}, {
		key: '10',
		primaryText: 'Item 10',
		items: [{
			key: '10-1',
			primaryText: '10-1',
			dropNested: true,
			items: []
		}, {
			key: '10-2',
			primaryText: '10-2',
			dropNested: true,
			items: []
		}]
	}],
	oneChild: [{
		key: '1',
		primaryText: 'Introductory Earth Sciences',
		dropNested: true,
		items: [{
			key: '1-1',
			primaryText: 'Glaciation',
			dropNested: true,
			items: []
		}]
	}, {
		key: '2',
		primaryText: 'Applied Wetland Science',
		dropNested: true,
		items: []
	}]
};
