import React, {Component} from "react"
import '../appearence/css/index.css'

class ConfirmWindow extends Component {

    render() {
        return (
        <div className = 'confirmWindow'>
            <p>{this.props.text}</p>
            <div className = 'flexboxRow'>
                <div className = 'longWhiteBtn' onClick = {this.props.cancel}>
                    <p>Нет</p>
                </div>
                <div className = 'longGreenBtn' onClick = {this.props.confirm}>
                    <p>Да</p>
                </div>
            </div>
        </div>)
    }
}

export default ConfirmWindow