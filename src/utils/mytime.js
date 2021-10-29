const timeAgo = seconds => {
	let month, date, hour, mint;
	let date2, date1;
	let message;
	return (
		(date2 = Number(new Date(new Date().toISOString()))),
		(date1 = new Date(seconds)),
		(month = Math.round(Math.abs((date1 - date2) / 31104e6))),
		(date = Math.round(Math.abs((date1 - date2) / 864e5))),
		(hour = Math.round(Math.abs((date1 - date2) / 36e5))),
		(mint = Math.round(Math.abs((date1 - date2) / 6e4))),
		mint < 60
			? (message = mint < 1 ? 'Just Now' : `${mint} mint ago`)
			: mint >= 60 && hour < 24
			? (message = `${hour} hour ago`)
			: hour >= 24 && date < 30
			? (message = `${date} days ago`)
			: date >= 30 && month < 12 && (message = `${month + 1} month ago`),
		message
	);
};
export default timeAgo;
