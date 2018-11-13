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
		sched,
		label: sched.room,
		times: [{
			"starting_time": sched.startTime,
			"ending_time": sched.endTime
		}]
		}
}

function timeFilter( sched ){
	const now = new Date();
	now.setHours(6);
	now.setMinutes(0);
	const later = new Date();
	later.setHours(21);
	later.setMinutes(0);
	// const later = now + (1000 * 60 * 60 * 24 * 2);

	return sched.startTime > now.getTime() && sched.endTime < later.getTime();
}

class Schedule extends Component {
	
	state = {};

	componentDidMount() {
		this.buildChart();
	}
	componentDidUpdate() {
		this.buildChart();
	}

	buildChart = () =>{
		const { schedules } = this.props;
		if( schedules ){
			const data = schedules
				.filter(s => s.location === "Trainyards" && s.room === "Co-ed Studio")
				.filter(timeFilter)
				.map(scheduleToTimeline);
				console.log(data);
			let chart = timelines();
			d3.select(this.svg)
				.attr("width", window.innerWidth)
				.attr("height", 300)
				.datum(data).call(chart);

			// this.setState({ data });
		}
	}

	render() {
		return (
			<div>
				<svg ref={node => this.svg = node}></svg>
				<pre className="App-header">
					{ this.state.schedules ? JSON.stringify(this.state.schedules, null, 2) : `Mervati` }
				</pre>
				
			</div>
  
		);
	}

}

export default Schedule;