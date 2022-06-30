import React from "react";

class AboutPage extends React.Component {

    render() {
        return (
            <div className="main_content" id="main_content">
                <div className="ui divider"></div>
                <div className="ui grid doubling stackable grid container">
                    <div className="twelve wide column home_content">
                        <h1>TODO</h1>
                        <ul>
                            <li>PORT SCAN</li>
                            <li>HTML/JS CRAWL & RECON</li>
                            <li>SCHEDULE SCANS (NUCLEI)</li>
                            <li>WAF FINGERPRINTING</li>
                            <li>LINKS/ENDPOINTS EXTRACTION</li>
                            <li>SENSITIVE INFO EXTRACTION</li>
                            <li>MANAGE NUCLEI TEMPLATES</li>
                            <li>MASSIVE IMPORT OF DOMAINS AND SUBDOMAINS</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

}

export default AboutPage;