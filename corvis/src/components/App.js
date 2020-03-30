import React from 'react';
import './App.css';
import GMap from './GMap';
import corona from '../api/corona';
import ReactTooltip from 'react-tooltip';

const d = (msg) => {
	console.log(msg);
};

// const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';
const geoUrl = 'https://raw.githubusercontent.com/shivampip/faCorana/master/corvis/data/map/India_Official.json';

class App extends React.Component {
	state = {
		data: [],
		count: 0,
		day: 'Click on buttons to start animation',
		row: null,
		tooktipData: '',
		event: 'confirmed', //confirmed, discharged, death
		isReady: false
	};

	async componentDidMount() {
		const response = await corona.get();
		if (response.data.success) {
			d('HISTORY FATCHED SUCCESS');
			const data = response.data.data;
			d(data);
			this.setState({ data: data, isReady: true });
		} else {
			d(response.data);
		}
	}

	animateNow = () => {
		setTimeout(() => {
			d('Next Animation');
			let row = this.state.data[this.state.count];
			// this.state.count = this.state.count + 1;

			var parts = row.day.split('-');
			var ndate = new Date(parts[0], parts[1] - 1, parts[2]);
			const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
			const [ { value: mo }, , { value: da }, , { value: ye } ] = dtf.formatToParts(ndate);
			let nday = `${da}-${mo}-${ye}`;

			d(row);
			this.setState({ count: this.state.count + 1, row: row, day: nday });
			if (this.state.count < this.state.data.length) {
				this.animateNow();
			} else {
				this.state.count = 0;
			}
		}, 500);
	};

	showHope = () => {
		// d('Hope: ' + this.state.count);
		setTimeout(() => {
			d('Next Hope');
			let rrow = this.state.data[this.state.count];
			// let row = Object.assign({}, rrow);
			let row = JSON.parse(JSON.stringify(rrow));
			// this.state.count = this.state.count + 1;
			if (this.state.count === 0) {
				d('Now Zero');
				for (let i = 0; i < row.regional.length; i++) {
					row.regional[i].confirmedCasesIndian = 0;
					row.regional[i].confirmedCasesForeign = 0;
					row.regional[i].deaths = this.state.data[this.state.data.length - 1].summary.deaths;
					row.regional[i].discharged =
						this.state.data[this.state.data.length - 1].summary.confirmedCasesIndian +
						this.state.data[this.state.data.length - 1].summary.confirmedCasesForeign;
				}
				row.summary.discharged =
					this.state.data[this.state.data.length - 1].summary.confirmedCasesIndian +
					this.state.data[this.state.data.length - 1].summary.confirmedCasesForeign;
				row.summary.deaths = this.state.data[this.state.data.length - 1].summary.deaths;
				row.summary.confirmedCasesIndian = 0;
				row.summary.confirmedCasesForeign = 0;
			} else {
				for (let i = 0; i < row.regional.length; i++) {
					row.regional[i].deaths = this.state.data[this.state.data.length - 1].summary.deaths;
					row.regional[i].discharged =
						this.state.data[this.state.data.length - 1].summary.confirmedCasesIndian +
						this.state.data[this.state.data.length - 1].summary.confirmedCasesForeign -
						row.regional[i].discharged;

					// row.summary.confirmedCasesIndian = 0;
					// row.summary.confirmedCasesForeign = 0;
				}
				row.summary.discharged =
					this.state.data[this.state.data.length - 1].summary.confirmedCasesIndian +
					this.state.data[this.state.data.length - 1].summary.confirmedCasesForeign -
					row.summary.confirmedCasesIndian -
					row.summary.confirmedCasesForeign;
				row.summary.deaths = this.state.data[this.state.data.length - 1].summary.deaths;
			}
			// var parts = row.day.split('-');
			// var ndate = new Date(parts[0], parts[1] - 1, parts[2]);
			var ndate = new Date();
			var numberOfDaysToAdd = this.state.data.length - this.state.count;
			ndate.setDate(ndate.getDate() + Math.floor(numberOfDaysToAdd / 2));
			const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
			const [ { value: mo }, , { value: da }, , { value: ye } ] = dtf.formatToParts(ndate);
			let nday = `We hope and pray: ${da}-${mo}-${ye}`;

			this.setState({ count: this.state.count - 1, row: row, day: nday });

			if (this.state.count >= 0) {
				this.showHope();
			} else {
				this.state.count = this.state.data.length;
			}
		}, 300);
	};

	render() {
		d(this.state.row);
		return (
			<div className="app">
				<div className="titleD">COVID-19 SPREAD IN INDIA</div>
				<div className="subtitleD">How this pandemic spread in our beautiful conuntry</div>
				<div className="controlP">
					<button
						className={`confirmedB ${this.state.event === 'confirmed' ? 'selected' : null}`}
						onClick={(eve) => {
							this.state.event = 'confirmed';
							this.state.count = 0;
							this.animateNow();
						}}
					>
						Confirmed
					</button>
					<button
						className={`dischargedB ${this.state.event === 'discharged' ? 'selected' : null}`}
						onClick={(eve) => {
							this.state.event = 'discharged';
							this.state.count = 0;
							this.animateNow();
						}}
					>
						Discharged
					</button>
					<button
						className={`deathB ${this.state.event === 'death' ? 'selected' : null}`}
						onClick={(eve) => {
							this.state.event = 'death';
							this.state.count = 0;
							this.animateNow();
						}}
					>
						Death
					</button>
				</div>
				<GMap
					className="gmap"
					geoUrl={geoUrl}
					cdata={this.state.row ? this.state.row.regional : null}
					event={this.state.event}
					setTooltipContent={(data) => this.setState({ tooktipData: data })}
				/>
				<ReactTooltip place="top" backgroundColor="white" effect="float" border={true} borderColor="black">
					{this.state.tooktipData}
				</ReactTooltip>

				<div className="dayDiv">{this.state.day}</div>
				<table className="dashboardT">
					<tbody>
						<tr>
							<th className="confirmed">Confirmed</th>
							<th className="discharged">Recovered</th>
							<th className="death">Deaths</th>
						</tr>
						<tr>
							<td>
								{this.state.row ? (
									this.state.row.summary.confirmedCasesIndian +
									this.state.row.summary.confirmedCasesForeign
								) : (
									0
								)}
							</td>
							<td>{this.state.row ? this.state.row.summary.discharged : 0}</td>
							<td>{this.state.row ? this.state.row.summary.deaths : 0}</td>
						</tr>
					</tbody>
				</table>
				<div className="hopeWrapper">
					<button
						className="hopeB"
						onClick={(eve) => {
							this.state.event = 'confirmed';
							this.state.count = this.state.data.length - 1;
							this.showHope();
						}}
					>
						What We Hope & Pray
					</button>
				</div>
				<div className="instB">
					<i>Data is not real-time</i>
				</div>
				<div className="tableHead">Useful Resources</div>
				<table className="dashboardT resourceT">
					<tbody>
						<tr>
							<td>National Helpline No.</td>
							<td>
								<h4>+91-11-23978046</h4>
							</td>
						</tr>
						<tr>
							<td>National Helpline No.</td>
							<td>
								<h4>1075</h4>
							</td>
						</tr>
						<tr>
							<td>COVID-19 Tracker India</td>
							<td>
								<a href="https://www.covid19india.org/">Link</a>
							</td>
						</tr>
						<tr>
							<td>Statewise Helpline No.</td>
							<td>
								<a href="https://www.mohfw.gov.in/coronvavirushelplinenumber.pdf" target="_blank">
									Download PDF
								</a>
							</td>
						</tr>

						<tr>
							<td>Quarantine guidlines</td>
							<td>
								<a href="https://www.mohfw.gov.in/pdf/SOPforqurantine.pdf">Download PDF</a>
							</td>
						</tr>
						<tr>
							<td>COVID-19 MyGov</td>
							<td>
								<a href="https://www.mygov.in/covid-19/">Link</a>
							</td>
						</tr>
						<tr>
							<td>COVID-19 WHO</td>
							<td>
								<a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019">Link</a>
							</td>
						</tr>
						<tr>
							<td>WHO Whatsapp Helpline</td>
							<td>
								<a href="http://wa.me/41798931892?text=hi" target="_blank">
									Chat
								</a>
							</td>
						</tr>
						<tr>
							<td>PM-CARES Fund Donation</td>
							<td>
								<a href="https://pib.gov.in/PressReleseDetailm.aspx?PRID=1608851">Donate</a>
							</td>
						</tr>
						<tr>
							<td>Myth Busters</td>
							<td>
								<a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters">
									Link
								</a>
							</td>
						</tr>
						<tr>
							<td>How to use Mask</td>
							<td>
								<a
									href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/when-and-how-to-use-masks"
									target="_blank"
								>
									Link
								</a>
							</td>
						</tr>
					</tbody>
				</table>
				<div className="banner">Stay Home, Stay Safe</div>
				<div className="banner banner2">Prepare, But Don't Panic</div>
				<div className="banner">Spread J♥️y, Not COVID-19</div>
				<div className="banner banner2">Thank You All The Doctors, Nurses & Emergency Workers</div>

				<div className="creditD">
					Developed by{' '}
					<a href="https://github.com/shivampip" target="_blank">
						Shivam Agrawal
					</a>
				</div>
				<div className={this.state.isReady ? null : 'loadContainer'}>
					<div className="loadT" style={{ display: this.state.isReady ? 'none' : 'visible' }}>
						Loading...
					</div>
				</div>
			</div>
		);
	}
}

export default App;
