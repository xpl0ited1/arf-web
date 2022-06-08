import React from "react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Message} from "semantic-ui-react";

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            token: "",
            isLoading: false,
            errorLogin: false
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    handleUserNameChange(e){
        e.preventDefault()
        this.setState({username:e.target.value})
    }

    handlePasswordChange(e){
        e.preventDefault()
        this.setState({password:e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault()
        this.setState({isLoading: true})
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        };
        fetch(API_BASE + ENDPOINTS.login, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    this.setState({isLoading: false, errorLogin: true})
                    return Promise.reject(error);
                }

                this.setState({ token: data.token })
                sessionStorage.setItem("sessionToken", data.token)

                this.setState({isLoading: false})
                //redirect to home
                //TODO: handle login send state to parents
                this.props.handleLogin(data.token)
                window.location = "/#/"
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    render() {
        return (
            <div className="main_content" id="main_content">
                <div className="ui divider"></div>
                <div className="ui grid">
                    <div className="ui column"></div>
                    <div className="ui seven wide column justified container segment" style={{style:"whitesmoke", paddingBottom: "25px", marginTop: "100px", backgroundColor: "black", color: "whitesmoke", borderColor: "black"}}>
                        <Message negative hidden={!this.state.errorLogin}>
                            <Message.Header>Error while trying to log-in</Message.Header>
                            <p>Wrong username/password combination</p>
                        </Message>
                        <div className="field">
                            <label htmlFor="usuario">Username</label>
                            <div className="ui fluid input">
                                <input type="text" name="username" id="username" onChange={this.handleUserNameChange}/>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="Contraseña">Password</label>
                            <div className="ui fluid input">
                                <input type="password" name="password" id="password" onChange={this.handlePasswordChange}/>
                            </div>
                        </div>
                        <div className="actions">
                            <Button type="submit" name="commit" value="Sign In" color={"green"} fluid inverted loading={this.state.isLoading}
                                   data-disable-with="Sign In" onClick={this.handleSubmit}>Sign In</Button>
                        </div>
                    </div>
                    <div className="ui column"></div>
                </div>
            </div>
        );
    }



}

export default Login;