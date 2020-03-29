import React from 'react';
import './GMap.css';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ZoomableGroup, Graticule } from 'react-simple-maps';
import { Sphere } from 'react-simple-maps';
import { geoPolyhedralWaterman } from 'd3-geo-projection';
import { geoCylindricalStereographic } from 'd3-geo-projection';

const d = (msg) => {
	console.log(msg);
};

const width = 400;
const height = 400;

// const projection = geoPolyhedralWaterman().translate([ width / 2, height / 2 ]).rotate([ 0, 78, 0 ]).scale(98);
const projection = geoCylindricalStereographic().translate([ width / 2, height / 2 ]).scale(98);

const GMap = (props) => {
	let maxLimit = 0;
	let colFill = 'purple';
	if (props.event === 'discharged') {
		maxLimit = 30; //25
		colFill = 'green';
	} else if (props.event === 'death') {
		maxLimit = 10; //5
		colFill = 'black';
	} else {
		maxLimit = 200; //189
		colFill = 'purple';
	}
	return (
		<div>
			{/* <ComposableMap> */}
			<ComposableMap className="gmap" width={width} height={height} projection={projection} data-tip="">
				<ZoomableGroup zoom={6} center={[ 82, 22 ]}>
					<Geographies geography={props.geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => {
								// d(geo);
								let name = geo.properties.name;
								let total = 0;
								let death = 0;
								let discharged = 0;
								let fillOpacity = 0;
								if (props.cdata) {
									// d(props.cdata);
									let matched = props.cdata.filter((row) => {
										return row.loc === name;
									});
									if (matched.length > 0) {
										total = matched[0].confirmedCasesIndian + matched[0].confirmedCasesForeign;
										death = matched[0].deaths;
										discharged = matched[0].discharged;

										// maxConfirm = maxConfirm < total ? total : maxConfirm;
										// maxDeath = maxDeath < death ? death : maxDeath;
										// maxDis = maxDis < discharged ? discharged : maxDis;

										// d(maxConfirm + ', ' + maxDeath + ', ' + maxDis); // 180, 5, 25
										if (props.event === 'discharged') {
											fillOpacity = discharged / maxLimit;
										} else if (props.event === 'death') {
											fillOpacity = death / maxLimit;
										} else {
											fillOpacity = total / maxLimit;
										}
										// fillOpacity= death/ 10;
										// fillOpacity = discharged / 30;
									}
								}
								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										// clipPath="url(#rsm-sphere)"
										fill={colFill}
										fillOpacity={fillOpacity}
										stroke="#969696"
										strokeOpacity="1"
										strokeWidth=".07"
										onMouseEnter={() => {
											props.setTooltipContent(
												<div className="tooltip">
													<p className="country">{name}</p>
													<table>
														<tbody>
															<tr className="confirmed">
																<td>Confirmed</td>
																<td>{total}</td>
															</tr>
															<tr className="discharged">
																<td>Discharged</td>
																<td>{discharged}</td>
															</tr>
															<tr className="death">
																<td>Death</td>
																<td>{death}</td>
															</tr>
														</tbody>
													</table>
												</div>
											);
										}}
										onMouseLeave={() => {
											props.setTooltipContent('');
										}}
										style={{
											default: {
												fill: { colFill },
												outline: 'none'
											},
											hover: {
												// fill: '#F53',
												fill: { colFill },
												stroke: 'black',
												strokeWidth: '0.2',
												outline: 'none'
											},
											pressed: {
												// fill: '#E42',
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
