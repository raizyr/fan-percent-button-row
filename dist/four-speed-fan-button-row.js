window.customCards = window.customCards || [];
window.customCards.push({
	type: "four-speed-fan-button-row",
	name: "four speed fan button row",
	description: "A plugin to display your Four speed fan controls in a button row.",
	preview: false,
});

const LitElement = customElements.get("ha-panel-lovelace") ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace")) : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class CustomFourSpeedPercentRow extends LitElement {

	constructor() {
		super();
		this._config = {
			customTheme: false,
			customSetpoints: false,
			reverseButtons: false,
			isTwoSpeedFan: false,
			isThreeSpeedFan: false,
			hideOff: false,
			sendStateWithSpeed: false,
			allowDisablingButtons: true,
			offPercentage: 0,
			lowPercentage: 25,
			medLowPercentage: 50,
			medPercentage: 75,
			hiPercentage: 100,
			width: '30px',
			height: '30px',
			isOffColor: '#f44c09',
			isOnLowColor: '#43A047',
			isOnMedLowColor: '#43A047',
			isOnMedColor: '#43A047',
			isOnHiColor: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customLowText: 'LOW',
			customMedLowText: 'MED LOW',
			customMedText: 'MED',
			customHiText: 'HIGH',
		};
	}

	static get properties() {
		return {
			hass: Object,
			_config: Object,
			_stateObj: Object,
			_offSP: Number,
			_lowSP: Number,
			_medSP: Number,
			_highSP: Number,
			_width: String,
			_height: String,
			_leftColor: String,
			_midLeftColor: String,
			_middleColor: String,
			_midRightColor: String,
			_rightColor: String,
			_leftText: String,
			_midLeftText: String,
			_middleText: String,
			_midRightText: String,
			_rightText: String,
			_leftName: String,
			_midLeftName: String,
			_middleName: String,
			_midRightName: String,
			_rightName: String,
			_hideLeft: String,
			_hideMidLeft: String,
			_hideMiddle: String,
			_hideMidRight: String,
			_hideRight: String,
			_leftState: Boolean,
			_midLeftState: Boolean,
			_middleState: Boolean,
			_midRightState: Boolean,
			_rightState: Boolean,
		};
	}

	static get styles() {
		return css`
			:host {
				line-height: inherit;
			}
			.box {
				display: flex;
				flex-direction: row;
			}
			.percentage {
				margin-left: 2px;
				margin-right: 2px;
				background-color: #759aaa;
				border: 1px solid lightgrey; 
				border-radius: 4px;
				font-size: 10px !important;
				color: inherit;
				text-align: center;
				float: left !important;
				padding: 1px;
				cursor: pointer;
			}
		`;
	}

	render() {
		return html`
			<hui-generic-entity-row .hass="${this.hass}" .config="${this._config}">
				<div id='button-container' class='box'>
					<button
						class='percentage'
						style='${this._leftColor};min-width:${this._width};max-width:${this._width};height:${this._height};${this._hideLeft}'
						toggles name="${this._leftName}"
						@click=${this.setPercentage}
						.disabled=${this._leftState}>${this._leftText}</button>
					<button
						class='percentage'
						style='${this._midLeftColor};min-width:${this._width};max-width:${this._width};height:${this._height};${this._hideMidLeft}'
						toggles name="${this._midLeftName}"
						@click=${this.setPercentage}
						.disabled=${this._midLeftState}>${this._midLeftText}</button>
					<button
						class='percentage'
						style='${this._middleColor};min-width:${this._width};max-width:${this._width};height:${this._height};${this._hideMiddle}'
						toggles name="${this._middleName}"
						@click=${this.setPercentage}
						.disabled=${this._middleState}>${this._middleText}</button>
					<button
						class='percentage'
						style='${this._midRightColor};min-width:${this._width};max-width:${this._width};height:${this._height};${this._hideMidRight}'
						toggles name="${this._midRightName}"
						@click=${this.setPercentage}
						.disabled=${this._midRightState}>${this._midRightText}</button>
					<button
						class='percentage'
						style='${this._rightColor};min-width:${this._width};max-width:${this._width};height:${this._height};${this._hideRight}'
						toggles name="${this._rightName}"
						@click=${this.setPercentage}
						.disabled=${this._rightState}>${this._rightText}</button>
				</div>
			</hui-generic-entity-row>
		`;
	}

	firstUpdated() {
		super.firstUpdated();
		this.shadowRoot.getElementById('button-container').addEventListener('click', (ev) => ev.stopPropagation());
	}

	setConfig(config) {
		this._config = { ...this._config, ...config };
	}

	updated(changedProperties) {
		if (changedProperties.has("hass")) {
			this.hassChanged();
		}
	}

	hassChanged() {
		const config = this._config;
		const stateObj = this.hass.states[config.entity];
		const custTheme = config.customTheme;
		const custSetpoint = config.customSetpoints;
		const revButtons = config.reverseButtons;
		const twoSpdFan = config.isTwoSpeedFan;
		const threeSpdFan = config.isThreeSpeedFan;
		const hide_Off = config.hideOff;
		const sendStateWithSpeed = config.sendStateWithSpeed;
		const allowDisable = config.allowDisablingButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const OnLowClr = config.isOnLowColor;
		const OnMedLowClr = config.isOnMedLowColor;
		const OnMedClr = config.isOnMedColor;
		const OnHiClr = config.isOnHiColor;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const OffSetpoint = config.offPercentage;
		const LowSetpoint = config.lowPercentage;
		const MedLowSetpoint = config.medLowPercentage;
		const MedSetpoint = config.medPercentage;
		const HiSetpoint = config.hiPercentage;
		const custOffTxt = config.customOffText;
		const custLowTxt = config.customLowText;
		const custMedLowTxt = config.customMedLowText;
		const custMedTxt = config.customMedText;
		const custHiTxt = config.customHiText;

		let offSetpoint;
		let lowSetpoint;
		let medLowSetpoint;
		let medSetpoint;
		let hiSetpoint;
		let low;
		let medlow;
		let med;
		let high;
		let offstate;

		if (custSetpoint) {
			offSetpoint = parseInt(OffSetpoint);
			medSetpoint = parseInt(MedSetpoint);
			if (parseInt(LowSetpoint) < 1) {
				lowSetpoint = 1;
			} else {
				lowSetpoint = parseInt(LowSetpoint);
			}
			if (parseInt(MedLowSetpoint) < 1) {
				medLowSetpoint = 1;
			} else {
				medLowSetpoint = parseInt(MedLowSetpoint);
			}
			if (parseInt(HiSetpoint) > 100) {
				hiSetpoint = 100;
			} else {
				hiSetpoint = parseInt(HiSetpoint);
			}
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.percentage > offSetpoint && stateObj.attributes.percentage <= ((medLowSetpoint + lowSetpoint) / 2)) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((medLowSetpoint + lowSetpoint) / 2) && stateObj.attributes.percentage <= ((medSetpoint + medLowSetpoint) / 2)) {
					medlow = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((medSetpoint + medLowSetpoint) / 2) && stateObj.attributes.percentage <= ((hiSetpoint + medSetpoint) / 2)) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((hiSetpoint + medSetpoint) / 2) && stateObj.attributes.percentage <= 100) {
					high = 'on';
				} else {
					offstate = 'on';
				}
			}
		} else {
			offSetpoint = 0 //parseInt(OffSetpoint);
			lowSetpoint = 25 //parseInt(LowSetpoint);
			medLowSetpoint = 50 //parseInt(MedLowSetpoint);
			medSetpoint = 75 //parseInt(MedSetpoint);
			hiSetpoint = 100 //parseInt(HiSetpoint);
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.percentage >= 13 && stateObj.attributes.percentage <= 38) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 39 && stateObj.attributes.percentage <= 63) {
					medlow = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 64 && stateObj.attributes.percentage <= 88) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 89 && stateObj.attributes.percentage <= 100) {
					high = 'on';
				} else {
					offstate = 'on';
				}
			}
		}

		let lowcolor;
		let medlowcolor;
		let medcolor;
		let hicolor;
		let offcolor;

		if (custTheme) {
			if (low == 'on') {
				lowcolor = 'background-color:' + OnLowClr;
			} else {
				lowcolor = 'background-color:' + buttonOffClr;
			}
			if (medlow == 'on') {
				medlowcolor = 'background-color:' + OnMedLowClr;
			} else {
				medlowcolor = 'background-color:' + buttonOffClr;
			}
			if (med == 'on') {
				medcolor = 'background-color:' + OnMedClr;
			} else {
				medcolor = 'background-color:' + buttonOffClr;
			}
			if (high == 'on') {
				hicolor = 'background-color:' + OnHiClr;
			} else {
				hicolor = 'background-color:' + buttonOffClr;
			}
			if (offstate == 'on') {
				offcolor = 'background-color:' + OffClr;
			} else {
				offcolor = 'background-color:' + buttonOffClr;
			}
		} else {
			if (low == 'on') {
				lowcolor = 'background-color: var(--switch-checked-color)';
			} else {
				lowcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (medlow == 'on') {
				medlowcolor = 'background-color: var(--switch-checked-color)';
			} else {
				medlowcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (med == 'on') {
				medcolor = 'background-color: var(--switch-checked-color)';
			} else {
				medcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (high == 'on') {
				hicolor = 'background-color: var(--switch-checked-color)';
			} else {
				hicolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (offstate == 'on') {
				offcolor = 'background-color: var(--switch-checked-color)';
			} else {
				offcolor = 'background-color: var(--switch-unchecked-color)';
			}
		}

		let offtext = custOffTxt;
		let lowtext = custLowTxt;
		let medlowtext = custMedLowTxt;
		let medtext = custMedTxt;
		let hitext = custHiTxt;

		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;

		let offname = 'off'
		let lowname = 'low'
		let medlowname = 'medlow'
		let medname = 'medium'
		let hiname = 'high'

		let hideoff = 'display:block';
		let hidemedium = 'display:block';
		let hidemedlow = 'display:block';
		let nohide = 'display:block';

		if (twoSpdFan) {
			hidemedium = 'display:none';
			hidemedlow = 'display:none';
		} else if (threeSpdFan) {
			hidemedium = 'display:none';
			hidemedlow = 'display:block';
		} else {
			hidemedium = 'display:block';
			hidemedlow = 'display:block';
		}


		if (hide_Off) {
			hideoff = 'display:none';
		} else {
			hideoff = 'display:block';
		}

		this._stateObj = stateObj;
		this._width = buttonwidth;
		this._height = buttonheight;
		this._offSP = offSetpoint;
		this._lowSP = lowSetpoint;
		this._medLowSP = medLowSetpoint;
		this._medSP = medSetpoint;
		this._highSP = hiSetpoint;

		if (revButtons) {
			this._leftState = (offstate == 'on' && allowDisable);
			this._midLeftState = (low === 'on' && allowDisable);
			this._midState = (medlow === 'on' && allowDisable);
			this._midRightState = (med === 'on' && allowDisable);
			this._rightState = (high === 'on' && allowDisable);
			this._leftColor = offcolor;
			this._midLeftColor = lowcolor;
			this._middleColor = medlowcolor;
			this._midRightColor = medcolor;
			this._rightColor = hicolor;
			this._leftText = offtext;
			this._midLeftText = lowtext;
			this._middleText = medlowtext;
			this._midRightText = medtext;
			this._rightText = hitext;
			this._leftName = offname;
			this._midLeftName = lowname;
			this._middleName = medlowname;
			this._midRightName = medname;
			this._rightName = hiname;
			this._hideLeft = hideoff;
			this._hideMidLeft = nohide;
			this._hideMiddle = hidemedlow;
			this._hideMidRight = hidemedium;
			this._hideRight = nohide;
		} else {
			this._leftState = (high === 'on' && allowDisable);
			this._midLeftState = (med === 'on' && allowDisable);
			this._midState = (medlow === 'on' && allowDisable);
			this._midRightState = (low === 'on' && allowDisable);
			this._rightState = (offstate == 'on' && allowDisable);
			this._leftColor = hicolor;
			this._midLeftColor = medcolor;
			this._middleColor = medlowcolor;
			this._midRightColor = lowcolor;
			this._rightColor = offcolor;
			this._leftText = hitext;
			this._midLeftText = medtext;
			this._middleText = medlowtext;
			this._midRightText = lowtext;
			this._rightText = offtext;
			this._leftName = hiname;
			this._midLeftName = medname;
			this._middleName = medlowname;
			this._midRightName = lowname;
			this._rightName = offname;
			this._hideRight = hideoff;
			this._hideMidRight = nohide;
			this._hideMiddle = hidemedlow;
			this._hideMidLeft = hidemedium;
			this._hideLeft = nohide;
		}
	}

	setPercentage(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = { entity_id: this._config.entity };

		if (level == 'off') {
			this.hass.callService('fan', 'turn_off', param);
		} else if (level == 'low') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._lowSP });
			} else {
				param.percentage = this._lowSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == 'medlow') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._medLowSP });
			} else {
				param.percentage = this._medLowSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == 'medium') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._medSP });
			} else {
				param.percentage = this._medSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == 'high') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._highSP });
			} else {
				param.percentage = this._highSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		}
	}
}

customElements.define('four-speed-fan-button-row', CustomFourSpeedPercentRow);
