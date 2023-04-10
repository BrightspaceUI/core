export const langResources = {
	basic: `The octopus has eight legs`,
	arguments: `The {animalType} has {animalLegCount} legs`,
	richText: `The octopus's name is <b>{octopusName}</b>`,
	escaped: `Bold octopus HTML: '<b>'{octopusName}'</b>'`,
	select:
`{bodyPart, select,
	legs {The octopus has eight legs}
	eyes {The octopus has two eyes}
	other {The octopus has many body parts}
}`,
	plural:
`{legCount, plural,
	=0 {The {animalType} has no legs}
	one {The {animalType} has # leg}
	other {The {animalType} has # legs}
}`,
	offset:
`{octopusCount, plural, offset:2
	=0 {All octopuses are accounted for}
	=1 {{octopusName} has escaped through the drain!}
	=2 {{octopusName} and {octopus2Name} have escaped through the drain!}
	one {{octopusName}, {octopus2Name}, and # other octopus have escaped through the drain!}
	other {{octopusName}, {octopus2Name}, and # other octopuses have escaped through the drain!}
}`,
	ordinal:
`{rank, selectordinal,
	=0 {The {animalType} is the smallest animal in the ocean}
	=1 {The {animalType} is the largest animal in the ocean}
	one {The {animalType} is the #st largest animal in the ocean}
	two {The {animalType} is the #nd largest animal in the ocean}
	few {The {animalType} is the #rd largest animal in the ocean}
	other {The {animalType} is the #th largest animal in the ocean}
}`,
	nested:
`{animalHabitat, select,
	ocean {{rank, selectordinal,
		=0 {The {animalType} is the smallest animal in the ocean}
		=1 {The {animalType} is the largest animal in the ocean}
		one {The {animalType} is the #st largest animal in the ocean}
		two {The {animalType} is the #nd largest animal in the ocean}
		few {The {animalType} is the #rd largest animal in the ocean}
		other {The {animalType} is the #th largest animal in the ocean}
	}}
	land {{rank, selectordinal,
		=0 {The {animalType} is the smallest animal on land}
		=1 {The {animalType} is the largest animal on land}
		one {The {animalType} is the #st largest animal on land}
		two {The {animalType} is the #nd largest animal on land}
		few {The {animalType} is the #rd largest animal on land}
		other {The {animalType} is the #th largest animal on land}
	}}
	other {{rank, selectordinal,
		=0 {The {animalType} is the smallest animal that can fly}
		=1 {The {animalType} is the largest animal that can fly}
		one {The {animalType} is the #st largest animal that can fly}
		two {The {animalType} is the #nd largest animal that can fly}
		few {The {animalType} is the #rd largest animal that can fly}
		other {The {animalType} is the #th largest animal that can fly}
	}}
}`

};
