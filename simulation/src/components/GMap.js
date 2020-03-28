import React from 'react';
import './GMap.css';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ZoomableGroup, Graticule } from 'react-simple-maps';
import { Sphere } from 'react-simple-maps';

const d = (msg) => {
	console.log(msg);
};

const GMap = (props) => {
	let maxConfirm = 0; //180
	let maxDeath = 0; //5
	let maxDis = 0; //25
	return (
		<div>
			<ComposableMap>
				<ZoomableGroup zoom={4} center={[ 87, 17 ]}>
					{/* <Graticule stroke="#DDD" clipPath="url(#rsm-sphere)" />
					<Sphere stroke="#FF5533" strokeWidth={2} /> */}
					<Geographies
						geography={props.geoUrl}
						// parseGeographies={(geog) => {
						// 	d('New Geog');
						// }}
					>
						{({ geographies }) =>
							geographies.map((geo) => {
								// d(geo);
								let name = geo.properties.name;
								let fillOpacity = 0;
								if (props.cdata) {
									// d(props.cdata);
									let matched = props.cdata.filter((row) => {
										return row.loc === name;
									});
									if (matched.length > 0) {
										let total = matched[0].confirmedCasesIndian + matched[0].confirmedCasesForeign;
										let death = matched[0].deaths;
										let discharged = matched[0].discharged;

										// maxConfirm = maxConfirm < total ? total : maxConfirm;
										// maxDeath = maxDeath < death ? death : maxDeath;
										// maxDis = maxDis < discharged ? discharged : maxDis;

										// d(maxConfirm + ', ' + maxDeath + ', ' + maxDis); // 180, 5, 25
										fillOpacity = total / 200;
										// fillOpacity= death/ 10;
										// fillOpacity = discharged / 30;
									}
								}
								let col = 'red';

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										// clipPath="url(#rsm-sphere)"
										fill={col}
										fillOpacity={fillOpacity}
										stroke="black"
										strokeOpacity="0.5"
										strokeWidth=".07"
										style={{
											default: {
												fill: { col },
												outline: 'none'
											},
											hover: {
												// fill: '#F53',
												fill: { col },
												strokeOpacity: '1.0',
												strokeWidth: '0.2'
											},
											pressed: {
												fill: '#E42',
												outline: 'none'
											}
										}}
									/>
								);
							})}
					</Geographies>
				</ZoomableGroup>
			</ComposableMap>
		</div>
	);
};

export default GMap;
