import React from "react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Form, Header, Icon, Label, Modal} from "semantic-ui-react";
import queryString from "query-string";
import CompanySubdomainAdd from "./companySubdomainAdd";
import fetcher from "../../api/fetcher";

class SingleDomain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domainId: "",
            openModal: false,
            domain: {},
            subdomains: [],
            isLoading: false,
            isDataLoading: false,
            addSubdomainModalOpen: false
        }
        this.#handleDomainDelete = this.#handleDomainDelete.bind(this)
    }

    componentDidMount() {
        this.props.checkLogin()
        let params = queryString.parse("?" + document.location.hash.split("?")[1])
        if (params.domainId !== undefined) {
            this.setState({domainId: params.domainId})
            this.getDomain(params.domainId)
            this.getSubdomains(params.domainId)
        }
    }

    setOpenModal = (set) => {
        this.setState({openModal: set})
    }

    getDomain = (domainId) => {
        this.setState({isDataLoading: true})
        const requestOptions = {
            method: 'GET'
        };
        fetcher(API_BASE + ENDPOINTS.domains + "/" + domainId, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.setState({
                    domain: data, domainName: "", companyID: "", companyId: "", isDataLoading: false
                })
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    getSubdomains = (domainId) => {
        const requestOptions = {
            method: 'GET'
        };
        fetcher(API_BASE + ENDPOINTS.domains + "/" + domainId + ENDPOINTS.subdomains, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.setState({
                    subdomains: (data ? data : []), domainName: "", companyID: "", companyId: ""
                })
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    setSubdomainAddModalOpen = (state) => {
        this.setState({
            addSubdomainModalOpen: state
        })
    }

    #handleDomainDelete = (e) => {
        this.setState({isLoading: true})
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetcher(API_BASE + ENDPOINTS.domains + "/" + this.state.domain.id + "/delete", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                this.setState({isLoading: false})
                window.location = "/#/domains"
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }


    render() {
        return (<div className="main_content" id="main_content">

            <div className="ui divider"></div>
            <div className="three wide column">
                <div className="uitwelve wide column home_content">
                    <h1>{this.state.domain.domain_name ? this.state.domain.domain_name : "Loading.."} | <Button
                        basic
                        color='red'
                        inverted
                        loading={this.state.isLoading}
                        size="mini"
                        onClick={this.#handleDomainDelete}

                    ><Icon name="trash alternate outline"></Icon>Delete?
                    </Button>
                    </h1>
                    <br/>
                    <div className="ui labeled icon buttons">

                        <CompanySubdomainAdd domain={this.state.domain} token={this.props.token}
                                             setSubdomainAddModalOpen={this.setSubdomainAddModalOpen}
                                             open={this.state.addSubdomainModalOpen} domainID={this.state.domainId} getSubdomains={this.getSubdomains}/>

                    </div>

                    {(!this.state.isLoading && this.state.subdomains.length === 0) ? <div><br/>
                        <center>No subdomains for this domain</center>
                    </div> : ""}

                    {!this.state.isLoading && this.state.subdomains.length > 0 ? <table
                        className={this.state.isDataLoading ? "ui loading form inverted table" : "ui inverted table"}>
                        <thead>
                        <tr>
                            <th>Subdomain</th>
                            <th>Ports</th>
                            <th>Technologies</th>
                            <th>Title</th>
                            <th>Added on</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.subdomains.map((subdomain, idx) => {
                            return <tr key={idx}>
                                <td className="selectable" style={{paddingLeft: "5px"}} onClick={(e) => {
                                    this.handleItemClick(e, subdomain)
                                }}>{subdomain.subdomain_name}</td>
                                <td>
                                    {subdomain.ports ? subdomain.ports.map((port, idxport) => {

                                        return <Label color="black" key={idxport}>
                                            {port.port_number}
                                        </Label>
                                    }) : "--"}
                                </td>
                                <td>
                                    {subdomain.technologies ? subdomain.technologies.map((tech, idxtech) => {

                                        return <Label color="black" key={idxtech}>
                                            {tech.technology_name}
                                        </Label>
                                    }) : "--"}
                                </td>
                                <td>{subdomain.http_title != "" ? subdomain.http_title : "---"}</td>
                                <td>{subdomain.created_at}</td>
                            </tr>
                        })}
                        </tbody>
                    </table> : ""}


                </div>
            </div>
        </div>);
    }
}

export default SingleDomain;