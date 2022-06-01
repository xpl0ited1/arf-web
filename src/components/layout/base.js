import React from "react"
import Companies from "../companies/companies";
import {Routes, Route, useLocation} from "react-router-dom";
import HorizontalMenu from "./horizontalmenu";
import Home from "./home";
import Login from "../users/login";
import Domains from "../domains/domains";
import SingleDomain from "../companies/singleDomain";

class BaseLayout extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            loggedIn: false,
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this)
    }

    handleLogin(token){
        if (token !== ""){
            this.setState({token: token, loggedIn: true})
        }else{
            console.log("ERROR")
        }
    }

    checkIfLoggedIn(){
        let token = localStorage.getItem("sessionToken")
        if(token != null && token !== ""){
            this.setState({token: token, loggedIn: true})
            return true
        }else{
            this.setState({token: "", loggedIn: false})
            return false
        }
    }

    componentDidMount() {
        if (this.checkIfLoggedIn()) {
            if (window.location.pathname === "/login") {
                window.location.pathname = "/"
            }
        }
    }

    render() {
        return (
            <div>
                <HorizontalMenu isLoggedIn={this.state.loggedIn}/>

                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/companies/domains" element={<SingleDomain />} />
                    <Route path="/login" element={<Login handleLogin={this.handleLogin} />} />
                    <Route path="/domains" element={<Domains />}/>
                </Routes>
            </div>
        )
    }
}



export default BaseLayout;