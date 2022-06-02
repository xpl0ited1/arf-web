import React from "react";

class Home extends React.Component {
    componentDidMount() {
        this.props.checkLogin()
    }

    render() {
        return (
            <div className="main_content" id="main_content">
                <div className="ui divider"></div>
                <div className="ui grid doubling stackable grid container">
                    <div className="three wide column">
                        <div className="twelve wide column home_content">
                            asdasd
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}

export default Home;