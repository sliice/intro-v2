import React, {Component} from "react"

export class AddIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdding: false
        }
    }

    handleAddActivating = e => {
        this.setState({
            isAdding: true
        })
        this.props.handleAddActivating && this.props.handleAddActivating(e)
    }

    render(){
        return (
            <svg className = 'addIcon' id = 'addIcon' onClick = {e => this.handleAddActivating(e)} width="250px" height="250px" viewBox="0 0 250 250" version="1.1">
                <defs>
                    <rect x="-1878" y="25" width="1935" height="931" id="rect-1"></rect>
                </defs>
                <g id="Logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect id="Rectangle-2" className = { this.state.isAdding && 'activeFill' || !this.state.isAdding && ' inactiveFill'}
                          transform="translate(125.000000, 125.000000) rotate(90.000000) translate(-125.000000, -125.000000) " x="110" y="85" width="30" height="80" rx="15"></rect>
                    <rect id="Rectangle-1"
                          className = { this.state.isAdding && 'activeFill' || !this.state.isAdding && ' inactiveFill'}
                          x="110" y="85" width="30" height="80" rx="15"></rect>
                    <circle id="Oval"
                            className = { this.state.isAdding && 'activeStroke' || !this.state.isAdding && ' inactiveStroke' }
                            stroke-width="50" cx="125" cy="125" r="100"></circle>
                </g>
            </svg>
        )
    }
}

export default AddIcon