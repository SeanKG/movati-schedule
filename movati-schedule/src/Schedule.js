import React, {
	Component
} from 'react';
import * as d3 from 'd3';
import { timelines } from 'd3-timelines';


// example sched:

// category: "CARDIO & STRENGTH"
// date: 1542085200000
// difficulty: "E"
// duration: "55"
// endTime: 1542110100000
// instructor: "Leanne W."
// location: "Trainyards"
// name: "20-20-20"
// room: "Co-ed Studio"
// startTime: 1542106800000
// timeString: "6:00am-6:55am"

function scheduleToTimeline( sched ){
	return {
		// class: "pA",
		label: sched.room,
		times: [{
			"starting_time": sched.startTime,
			"ending_time": sched.endTime
		}]
		}
}


class Schedule extends Component {
	
	state = {};

	componentDidMount() {
		this.buildChart();
	}
	componentDidUpdate() {
		this.buildChart();
		console.log(this.props.schedules);
	}

	buildChart = () =>{
		const { schedules } = this.props;
		if( schedules ){
			const data = schedules
							.filter(s => s.location === "Trainyards")
							.map(scheduleToTimeline);
			let chart = timelines();
			d3.select(this.svg)
				.attr("width", 500)
				.attr("height", 500)
				.datum(data).call(chart);
		}
	}

	render() {
		return (
			<svg ref={node => this.svg = node}></svg>
		);
	}

}

export default Schedule;