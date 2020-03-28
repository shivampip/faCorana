import React from 'react';
import './App.css';
import GMap from './GMap';
import corona from '../api/corona';

const d = (msg) => {
	console.log(msg);
};

// const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';
const geoUrl = 'https://raw.githubusercontent.com/shivampip/faCorana/master/simulation/data/map/India_Official.json';

class App extends React.Component {
	state = {
		data: [],
		count: 0,
		day: '',
		row: null
	};

	async componentDidMount() {
		const response = await corona.get();
		if (response.data.success) {
			d('HISTORY FATCHED SUCCESS');
			const data = response.data.data;
			d(data);
			this.setState({ data: data });
		} else {
			d(response.data);
		}
	}

	componentDidUpdate() {
		if (this.state.count !== -1) {
			setTimeout(() => {
				this.nextCycle();
			}, 500);
		}
	}

	nextCycle = () => {
		if (this.state.data) {
			let row = this.state.data[this.state.count];
			d(row.day);
			if (this.state.data.length - 1 === this.state.count) {
				this.setState({ count: -1, row: row.regional });
			} else {
				this.setState({ count: this.state.count + 1, row: row.regional, day: row.day });
			}
			// this.state.count = this.state.count + 1;
			// d(row);
		}
	};

	render() {
		// this.nextCycle();
		return (
			<div className="app">
				<h2>Hello World</h2>
				<h3>{this.state.day}</h3>
				<GMap geoUrl={geoUrl} cdata={this.state.row} />
			</div>
		);
	}
}

export default App;
