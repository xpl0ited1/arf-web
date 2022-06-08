import React from "react";

class Logout extends React.Component{
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        sessionStorage.removeItem("sessionToken")
        window.location = "/"
    }


    render() {
        return (
            <div>
                Logging out..
            </div>
        );
    }


}

export default Logout;