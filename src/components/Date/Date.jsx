
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { debounce, defer } from 'lodash'
import { getCalendarMonthWeeks, momentTypeChecker, uuid } from 'helpers'
import { defaultDebounce, momentFormat } from 'settings'

// TO DO - support plain english inputs ('yesterday', 'today')
// TO DO - support double click on calendar to set value
// TO DO - support scroll to change value

class DateInput extends PureComponent {

	state = {
      value: this.props.value,
			calendarOpen: true,
			allowPageNext: true,
			allowPagePrev: true,
			focusedDate: this.props.value || moment(),
			hasFocus: false
    }

    pendingOnChange = false

    debounceBy = !this.props.debounce ?
        0 : typeof this.props.debounce === 'number' ?
        this.props.debounce : defaultDebounce

    parentOnChange = debounce(value => {
        this.pendingOnChange = false
        this.props.onChange(value)
    }, this.debounceBy)

    triggerParentOnChange = value => {
        this.pendingOnChange = true
        this.parentOnChange(value.startOf('day')) // DEV - this is meant to be an outgoing sanitization, I'm not sure this is the best place for it.
    }

    flush = () => this.parentOnChange.flush()

    cancel = () => {
        this.pendingOnChange = false
        this.parentOnChange.cancel()
    }

	getInputRef = el => { this.inputEl = el }

    componentWillReceiveProps({ value }) {

        if (this.pendingOnChange ||
			(value && value.isSame(this.state.value))) return

		this.setState(() => ({
			value,
			focusedDate: value || moment()
		}))

    }

    componentWillUnmount() { this.flush() }

    onChange = evt => {
        const newValue = evt.target.value
        this.setState(() => ({ value: newValue }), () => {
            this.triggerParentOnChange(newValue)
        })
    }

    onClear = () => {
        const newValue = ''
        this.setState(() => ({ value: newValue }), () => {
            this.flush()
            if (this.props.onClear) {
                this.props.onClear(newValue)
            } else {
                this.triggerParentOnChange(newValue)
            }
        })
    }



    forceParentOnChange = value => {
        if (!this.pendingOnChange) return
        this.cancel()
        this.props.onChange(value)
    }

	// Focus handling

	inputElToken = uuid()

	focusInputEl = () => { this.inputEl.focus() }

	blurInputEl = () => { this.inputEl.blur() }

	onInputFocus = e => {
		this.setState(() => ({ hasFocus: true }))
	}

	onInputBlur = e => {
		const event = e
		event.preventDefault()
		event.stopPropagation()
		const { onBlur } = this.props

		// Defer one tick so the function has access to the new focused element
		defer(() => {

			const activeElData = document.activeElement.attributes.data
			const didBlur = !activeElData ||
				activeElData.value !== this.inputElToken

			if (didBlur) {
				this.setState(() => ({
					hasFocus: false ,
					focusedDate: this.props.value || moment(),
				}), () => {
					this.forceParentOnChange(event)
					if (onBlur) onBlur(event)
				})
			}
		})
    }

	onDropdownFocus = e => { this.inputEl.focus() }

	// User event handling

	handleSelectDay = newValue => {
		this.setState(() => ({
			value: newValue,
			focusedDate: newValue
		}), () => {
            this.triggerParentOnChange(newValue)
			this.blurInputEl()
		})
	}

	onKeyDown = evt => {
		const key = evt.key
		evt.stopPropagation()
		if (key !== 'Tab') evt.preventDefault()

		const { focusedDate } = this.state
		if (!focusedDate) return

		const newFocusedDate = focusedDate.clone()
		let selectedDay

		switch (key) {
			case 'ArrowUp':
				newFocusedDate.subtract(1, 'week')
				break
			case 'ArrowLeft':
				newFocusedDate.subtract(1, 'day')
				break
			case 'ArrowDown':
				newFocusedDate.add(1, 'week')
				break
			case 'ArrowRight':
				newFocusedDate.add(1, 'day')
				break
			case ' ':
			case 'Enter':
				this.handleSelectDay(focusedDate)
				selectedDay = true
				break
			case 'Escape':
				// onBlur()
				break
			default:
				break
		}

		if (!selectedDay) this.setState(() => ({
			focusedDate: newFocusedDate
		}))
	}

	// Calendar navigation

	handlePagePrev = () => {

		// check min validity

		this.setState(({ focusedDate }) => ({
			focusedDate: focusedDate
				.clone()
				.subtract(1, 'month')
				.endOf('month'),
			allowPagePrev: true
		}))

	}

	handlePageNext = () => {

		// check max validity

		this.setState(({ focusedDate }) => ({
			focusedDate: focusedDate
				.clone()
				.add(1, 'month')
				.startOf('month'),
			allowPagePrev: true
		}))

	}

    // Rendering

    renderIcon = () => {
        const { onClear, icon, loading } = this.props
        if (loading) {
            return <i className="icon loading" />
        } else if (this.state.value && onClear) {
            return <i
                className="icon remove av action"
                onClick={this.onClear}
            />
        } else if (icon && typeof icon === 'string') {
            return <i className={`icon ${icon}`} />
        } else if (icon) {
            return <i className="icon calendar" />
        }
    }

    renderDisabled = disabled => {

        if (!disabled) return

        return (<div className="disabled-overlay">
            {typeof disabled === 'string' &&
                <p>{disabled}</p>}
        </div>)
    }

	renderDropdown = focusedDate => (
		<div
			className="dropdown"
			onFocus={this.onDropdownFocus}
			tabIndex={1}
		>
			<div className="av header">
				<i
					className="icon chevron left"
					onClick={this.handlePagePrev}
				/>
				<p className="title">{focusedDate.format("MMMM YYYY")}</p>
				<i
					className="icon chevron right"
					onClick={this.handlePageNext}
				/>
			</div>

			<div className="day-names">
				<span>Sun</span>
				<span>Mon</span>
				<span>Tue</span>
				<span>Wed</span>
				<span>Thu</span>
				<span>Fri</span>
				<span>Sat</span>
			</div>

			<div
				className="calendar"
			>
				{/* onKeyDown={debounce(this.onKeyDown, defaultDebounce)} */}
				{getCalendarMonthWeeks(focusedDate, { allowOutside: true })
					.map((week, i) => (
						<div className="week" key={i}>
							{week.map((day, j) =>
								day && day.month() === focusedDate.month() ?
									<div
										className={`day selectable ${
											day.isSame(
												focusedDate, 'day'
											) ? 'active' : ''
										}`}
										onClick={() => {
											this.handleSelectDay(day)
										}}
										key={j}
									>{day.format("D")}</div> :
									<div
										className="day disabled"
										key={j}
									>{day && day.format("D")}</div>
							)}
						</div>
					))}
			</div>
		</div>
	)


    render() {
        return (
            <div className={`av date input ${
                this.props.inline ? 'inline' : ''
            }`}>
                {this.renderDisabled(this.props.disabled)}
                <input
                    autoComplete="false"
                    autoFocus={this.props.autoFocus}
                    className="exempt"
					data={this.inputElToken}
                    disabled={this.props.disabled}
                    onChange={this.onChange}
                    onBlur={this.onInputBlur}
                    onFocus={this.onInputFocus}
                    onKeyDown={this.onKeyDown}
                    placeholder={this.props.placeholder}
					ref={this.getInputRef}
                    spellCheck="false"
                    type="text"
                    value={this.state.value ?
						this.state.value.format(this.props.format) : ''}
                />
                {this.renderIcon()}
				{this.state.hasFocus &&
					this.renderDropdown(this.state.focusedDate)}
			</div>
        )
    }
}

DateInput.propTypes = {
    /**
    * focus the input as soon as it enters the DOM
    */
    autoFocus: PropTypes.bool,
    /**
    * provides a different set of styles ideal for
    * use within lines of text (formerly called 'compact')
    */
    inline: PropTypes.bool,
    /**
    * stop the component from receiving user input, when passed a
    * string, that string will be displayed on hover
    */
    disabled: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    /**
    * a string to pass to moment's format method
    */
    format: PropTypes.string,
    /**
    * display a calendar icon or an explicitly specified icon
	* in the right side of the input
    */
    icon: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    /**
    * display a loading animation (overwrites the icon)
    */
    loading: PropTypes.bool,
    /**
    * TO DO - enforce maximum possible date value (inclusive)
    */
    max: momentTypeChecker,
    /**
    * TO DO - enforce minimum possible date value (inclusive)
    */
    min: momentTypeChecker,
    /**
    * invoke on input blur
    */
    onBlur: PropTypes.func,
    /**
    * invoke with the new value whenever the value changes
    */
    onChange: PropTypes.func.isRequired,
    /**
    * display a clear button when there is an input value,
    * invoke when it's clicked
    */
    onClear: PropTypes.func,
    /**
    * invoke on enter press
    */
    onEnter: PropTypes.func,
    /**
    * input a date range (two dates instead of one)
    */
    range: PropTypes.bool,
    /**
    * display the plain value without edit capabilities
    */
    readOnly: PropTypes.bool,
    /**
    * text to display when the input value is empty
    */
    placeholder: PropTypes.string,
    /**
    * the value of the input, must be a moment object
    */
    value: momentTypeChecker
}

// TO DO - a bunch of these can easily be made into a parent class.

DateInput.defaultProps = {
	format: momentFormat._,
    inline: false,
    debounce: false,
    disabled: false,
    icon: false,
    readOnly: false,
    value: ''
}

export default DateInput
