import React from "react";
import {Button, Modal} from "semantic-ui-react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import DomainsAdd from "./domainsAdd";
import fetcher from "../../api/fetcher";

class CompanyDomains extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domains: [],
            domain: {},
            domainsAddOpenModal: false,
            isLoading: false
        }

        this.handleItemClick = this.handleItemClick.bind(this)
    }

    componentDidMount() {
        this.setState({
            domains: (this.props.company != null ? (this.props.company.domains ? this.props.company.domains : []) : []),
            isLoading: false
        })
        //this.getCompanyDomains(this.props.companyId)
    }

    getCompanyDomains = (companyId) => {
        this.setState({isLoading: true})
        const requestOptions = {
            method: 'GET'
        };
        fetcher(API_BASE + ENDPOINTS.companies + "/" + companyId, requestOptions)
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
                    domains: (data != null ? (data.domains ? data.domains : []) : []),
                    companyName: "",
                    reportingUrl: "",
                    companyId: "",
                    isLoading: false
                })
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    handleItemClick = (e, domain) => {
        e.preventDefault()
        //this.setState({domain: domain})
        //this.setState({updateOpenModal: true})
        window.location = "/#/company-domains?domainId=" + domain.id
    }

    setDomainAddOpenModal = (set) => {
        this.setState({domainsAddOpenModal: set})
    }


    render() {
        return (
            <Modal
                basic
                centered={false}
                dimmer={"blurring"}
                onClose={() => this.props.setDomainsOpenModal(false)}
                open={this.props.domainsOpenModal}
                size='large'
            >
                <Modal.Header>{this.props.companyName} domains <br/><br/>
                    <Button color="green" inverted onClick={(e) => this.setDomainAddOpenModal(true)}><i
                        className="plus icon"></i>Add
                        Domain</Button>
                </Modal.Header>
                <Modal.Content scrolling>
                    <table className={this.state.isLoading ? "ui loading form inverted table" : "ui inverted table"}>
                        <thead>
                        <tr>
                            <th>Domain Name</th>
                            <th>Added on</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.domains.map((domain, idx) => {
                            return <tr key={idx}>
                                <td className="selectable" style={{paddingLeft: "5px"}} onClick={(e) => {
                                    this.handleItemClick(e, domain)
                                }}>{domain.domain_name}</td>
                                <td>{domain.created_at}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        inverted
                        color='blue'
                        icon='check'
                        content='Done'
                        onClick={() => this.props.setDomainsOpenModal(false)}
                    />
                </Modal.Actions>

                <DomainsAdd domainsAddOpenModal={this.state.domainsAddOpenModal}
                            setDomainAddOpenModal={this.setDomainAddOpenModal}
                            getCompanyDomains={this.getCompanyDomains}
                            companyId={this.props.companyId}
                            token={this.props.token}
                />

            </Modal>
        );
    }

}

export default CompanyDomains;