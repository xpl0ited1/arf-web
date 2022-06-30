import React from "react"
import {Link} from "react-router-dom"

class HorizontalMenu extends React.Component {

    render() {
        if (this.props.hide) {
            return (<div></div>)
        } else {
            if (this.props.isLoggedIn) {
                return (

                    <div className="menu_horizontal">
                        <ul>
                            <li><Link to="/" className="">HOME</Link></li>
                            <li><Link to="/companies">COMPANIES</Link></li>
                            <li><Link to="/domains">DOMAINS</Link></li>
                            <li><Link to="/api-keys">API KEYS</Link></li>
                            <li><Link to="/events">EVENTS</Link></li>
                            <li><Link to="/scans">SCANS</Link></li>
                            <li><Link to="/nuclei">NUCLEI TEMPLATES</Link></li>
                            <li><Link to="/users">USERS</Link></li>
                            <li><Link to="/about">ABOUT</Link></li>
                            <li><Link to="/logout">LOGOUT</Link></li>
                        </ul>
                    </div>
                );
            } else {
                return (

                    <div className="menu_horizontal">
                        <ul>
                            <li><Link to="/" className="">HOME</Link></li>
                            <li><Link to="/login">LOGIN</Link></li>
                            <li><Link to="/about">ABOUT</Link></li>
                        </ul>
                    </div>
                );
            }
        }
    }

}

export default HorizontalMenu;