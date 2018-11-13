import parse from 'parse-jsonp';

const now = () => new Date().getTime();
const baseUrl = `https://www.groupexpro.com/schedule/embed/json.php`;
const callbackFn = `&callback=cbFn&_=`;
const ottawaArea = `&a=577`;

const scheduleUrl = `${baseUrl}?schedule${ottawaArea}`;
const locationUrl = `${baseUrl}?locations${ottawaArea}`;
const categoriesUrl = `${baseUrl}?categories${ottawaArea}`;

const fetchAllSchedules = async => {
	const locations = fetchLocations();

}

export const fetchSchedule = async (location) => {
	const times = getSevenDaysFromNow();
	const url = `${scheduleUrl}${callbackFn}${now()}&location=${location.code}&start=${times[0]}&end=${times[1]}`;
	const scheduleResponse = await getAndParseJsonP(url);
	return parseSchedule(scheduleResponse.aaData);
}

export const fetchLocations = async () => {
	const url = `${locationUrl}${callbackFn}${now()}`;
	const locationResponse = await getAndParseJsonP(url);
	return parseLocations(locationResponse);
}

const fetchCategories = async () => {
	// {
	// 		"MOVATI FUEL": "6776",
	// 		"CARDIO & STRENGTH": "6994",
	// 		"STRENGTH": "6995",
	// 		"WELLNESS": "6996",
	// 		"AQUA": "6997",
	// 		"CARDIO": "6998",
	// 		"CYCLE": "6999",
	// 		"YOGA": "7000",
	// 		"ACTIVE KIDS CLUB": "7018",
	// 		"SMALL GROUP TRAINING": "7090",
	// 		"SPORTS": "7096",
	// 		"MAINTENANCE ": "7121"
	// }
	const url = `${categoriesUrl}${callbackFn}${now()}`;
	const categoriesResponse = await getAndParseJsonP(url);
	return parseCategories(categoriesResponse);
}

const getAndParseJsonP = async (url) => {
	// turns JSONP nonsense into JSON while avoiding CORS drama
	var proxy_url = 'https://cors-anywhere.herokuapp.com/';
	var target_url = url;
	let resp = await fetch(`${proxy_url}${target_url}`)
	let respJson = await resp.text()
		.then((jsonp) => parse('cbFn', jsonp))
		.then((json) => json);
	return respJson;
}

const parseLocations = (locationsJson) => {
	// { 
	// 	"Trainyards": 
	// 	{ 
	// 		fullName: "Movati Athletic - Trainyards", 
	// 		code: 2308 
	// 	} 
	// }

	return Object.entries(locationsJson)
		.reduce((obj, [key, value]) => ({ ...obj,
			[value.substring(18)]: {
				fullName: value,
				code: key
			}
		}), {});
}

const parseSchedule = (scheduleJson) => {
	// {
	//		date: 1541394000000
	// 		timeString: "6:00am-6:55am"
	// 		startTime: 1541415600000
	// 		endTime: 1541418900000
	//	 	duration: "55"
	//	 	instructor: "Todd L."
	//	 	location: "Trainyards"
	// 		name: "Kettlebell Strength"
	//		difficulty: "I/A",
	// 		room: "Co-ed Studio"
	// 		category: "STRENGTH"
	// }
	return scheduleJson.map(schedule => {
		const times = schedule[1].split("-").map(time => time.slice(0, -2));
		const difficultyBits = schedule[2].split(" (");
		const difficulty = difficultyBits.length > 1 ? difficultyBits[1].slice(0, -1) : "";
		return ({
			date: new Date(schedule[0]).getTime(),
			timeString: schedule[1],
			startTime: new Date(`${schedule[0]} ${times[0]}`).getTime(),
			endTime: new Date(`${schedule[0]} ${times[1]}`).getTime(),
			name: difficultyBits[0],
			difficulty: difficulty,
			room: schedule[4].slice(0, -6),
			category: schedule[5],
			instructor: schedule[6],
			duration: schedule[7],
			location: schedule[8].substring(18)
		})
	});
}

const getSevenDaysFromNow = () => {
	const now = new Date();
	const sevenDaysFromNow = new Date().setDate(now.getDate() + 7);

	return [(now - (now % 1000)) / 1000, (sevenDaysFromNow - (sevenDaysFromNow % 1000)) / 1000];
}

const parseCategories = (categoriesJson) => {
	return Object.entries(categoriesJson)
		.reduce((obj, [key, value]) => ({ ...obj,
			[value.toUpperCase().trim()]: key
		}), {});
}