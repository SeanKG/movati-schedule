import React, {
	Component
} from 'react';
import * as d3 from 'd3';
import { timelines } from 'd3-timelines';

const testData = [{
	class: "pA",
	label: "person a",
	times: [{
		"starting_time": 1355752800000,
		"ending_time": 1355759900000
	}, {
		"starting_time": 1355767900000,
		"ending_time": 1355774400000
	}]
}, {
	class: "pB",
	label: "person b",
	times: [{
		"starting_time": 1355759910000,
		"ending_time": 1355761900000
	}]
}, {
	class: "pC",
	label: "person c",
	times: [{
		"starting_time": 1355761910000,
		"ending_time": 1355763910000
	}]
}];

class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.buildChart()
	}
	componentDidUpdate() {
		this.buildChart()
	}

	buildChart = () =>{
		let chart = timelines();
		d3.select(this.svg).attr("width", 500).attr("height", 500).datum(testData).call(chart);
	}

	render() {
		return (
			<svg id='#schedule' width={500} height={500} ref={node => this.svg = node}></svg>
		);
	}

}

export default Schedule;