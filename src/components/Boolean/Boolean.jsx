
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const BooleanInput = ({ icon, label, value, onChange }) => {

	if (icon) return (
		<label className="av boolean input">
			<input
				tabIndex="1"
				type="checkbox"
				checked={value}
				onChange={e => { onChange(!value) }}
			/>
			<i className={`av icon ${icon} ${value ? 'active' : ''}`} />
			{label && <span className="label" >{label}</span>}
		</label>
	)

	if (label) return (
		<label className="av boolean input">
			<input
				tabIndex="1"
				type="checkbox"
				checked={value}
				onChange={e => { onChange(!value) }}
			/>
			<span className={`button ${value ? 'active' : ''}`}>{label}</span>
		</label>

	)
}

BooleanInput.defaultProps = {

}

BooleanInput.propTypes = {
	/**
	* stop the component from receiving user input, when passed a
	* string, that string will be displayed on hover
	*/
	disabled: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string
	]),
	/**
	* icon to display as checkbox
	*/
	icon: PropTypes.string,
	/**
	* text to display as checkbox, or, if an icon is provided,
	* text to display beside the input
	*/
	label: PropTypes.string,
	/**
	* called when the value changes with the new value
	*/
	onChange: PropTypes.func.isRequired,
	/**
	* value of the input
	*/
	value: PropTypes.bool.isRequired
}

export default BooleanInput
