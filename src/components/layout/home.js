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
                    <div className="twelve wide column home_content">
                        <h1>Active Recon Framework - Web Management</h1>
                        <p>by xpl0ited1</p>
                        <br />
                        <br />
                        <br />
                        <p>
                            <a href="https://github.com/xpl0ited1/arf-web/wiki" className="link_text">Read the docs</a>
                        </p>
                        <div className="ui divider"></div>
                        <p>
                            If you want to contribute to this project just create a pull request at <a className="link_text" href="https://github.com/xpl0ited1/arf-web">Github</a>
                        </p>
                    </div>
                </div>

            </div>
        );
    }

}

export default Home;