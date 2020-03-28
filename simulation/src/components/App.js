import React from 'react';
import './App.css';
import GMap from './GMap';

// const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';
const geoUrl = '../../data/map/world.json';

class App extends React.Component {
	render() {
		return (
			<div className="app">
				<h2>Hello World</h2>
				<GMap geoUrl={geoUrl} />
			</div>
		);
	}
}

export default App;
