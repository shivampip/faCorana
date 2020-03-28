import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GMap = (props) => {
	return (
		<div>
			<ComposableMap>
				<Geographies geography={props.geoUrl}>
					{({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)}
				</Geographies>
			</ComposableMap>
		</div>
	);
};

export default GMap;
