
// get a random uuid
export function uuid() {

	const random4 = () => (
		(((1 + Math.random())*0x10000)|0).toString(16).substring(1)
	)

	return (
		random4() + random4() + "-" +
		random4() + "-" +
		random4() + "-" +
		random4() + "-" +
		random4() + random4() +	random4()
	)
}

// takes two strings, determines if they match according to loose specifications
export const fuzzyMatch = (possibleMatch='', text='') => {

	possibleMatch = possibleMatch.toLowerCase()
	text = text.toLowerCase()

	const matchLength = possibleMatch.length
	const textLength = text.length

	if (textLength > matchLength) return false
	if (textLength === matchLength) return text === possibleMatch

	outer: for (let i = 0, j = 0; i < textLength; i++) {
		const nch = text.charCodeAt(i)

		while (j < matchLength) {
			if (possibleMatch.charCodeAt(j++) === nch) continue outer
		}

		return false
	}

	return true
}


// given a moment object, return an array of arrays representing calendar
// days for that month
export function getCalendarMonthWeeks(month, { allowOutside=false }={}) {
	if (!moment.isMoment(month) || !month.isValid())
		throw new Error('month argument must be a valid moment object')

	const firstDayOfWeek = 0 // Start on sunday
	// const enableOutsideDays = true // use out of range days to fill matrix

	const firstOfMonth = month.clone().startOf('month').hour(12)
	const lastOfMonth = month.clone().endOf('month').hour(12)

	// calculate the exact first and last days to fill the entire matrix
	// (considering days outside month)
	const prevDays = ((firstOfMonth.day() + 7 - firstDayOfWeek) % 7)
	const nextDays = ((firstDayOfWeek + 6 - lastOfMonth.day()) % 7)
	const firstDay = firstOfMonth.clone().subtract(prevDays, 'day')
	const lastDay = lastOfMonth.clone().add(nextDays, 'day')

	const totalDays = lastDay.diff(firstDay, 'days') + 1

	const currentDay = firstDay.clone()
	const weeksInMonth = []

	for (let i = 0; i < totalDays; i++) {
	  if (i % 7 === 0) weeksInMonth.push([])

	  let day = null
	  if ((i >= prevDays && i < (totalDays - nextDays)) || allowOutside) {
		day = currentDay.clone()
	  }

	  weeksInMonth[weeksInMonth.length - 1].push(day)

	  currentDay.add(1, 'day')
	}

	return weeksInMonth

}

export function momentTypeChecker(props, name, component) {
	const val = props[name]
	if (!!val && val.constructor.name !== 'Moment')
		return new Error(
			`${component}: value must be falsy or moment object`
		)
}
