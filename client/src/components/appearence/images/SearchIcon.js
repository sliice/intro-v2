import React, {Component} from "react"

export class SearchIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearching: false
        }
    }

    handleSearchActivating = (e) => {
        e.preventDefault()
        this.setState({
            isSearching: true
        })
        this.props.handleSearchActivating(e)
    }

    render() {
        return (
            <svg className = 'searchIcon' name = 'searchIcon' width="250px" height="277px" viewBox="0 0 250 277" version="1.1"
                 onClick={e => this.handleSearchActivating(e)}>
                <g id="Logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path className = {   this.state.isSearching && 'activeStroke activeFill' ||
                    !this.state.isSearching && 'inactiveStroke inactiveFill'}
                          d="M256.23536,245.633373 C256.240323,245.854751 256.242819,246.076789 256.242819,246.299457 C256.242819,261.211145 245.049938,273.299457 231.242819,273.299457 C217.4357,273.299457 206.242819,261.211145 206.242819,246.299457 C206.242819,246.076789 206.245315,245.854751 206.250278,245.633373 Z" id="Combined-Shape" transform="translate(231.242819, 259.466415) rotate(-40.000000) translate(-231.242819, -259.466415) "></path>
                    <rect id="Rectangle"
                          className = {   this.state.isSearching && 'activeStroke activeFill' ||
                          !this.state.isSearching && 'inactiveStroke inactiveFill'}
                          transform="translate(199.856726, 222.096267) rotate(-40.000000) translate(-199.856726, -222.096267) " x="174.856726" y="186.596267" width="50" height="71"></rect>
                    <circle id="Oval"
                            className = {   this.state.isSearching && 'activeStroke' || !this.state.isSearching && 'inactiveStroke'}
                            stroke-width="50" cx="125" cy="125" r="100"></circle>
                </g>
            </svg>
        )
    }
}

export default SearchIcon