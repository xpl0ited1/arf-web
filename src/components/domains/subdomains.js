import React from "react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Label, Modal} from "semantic-ui-react";
import DomainsAdd from "../companies/domainsAdd";

class DomainSubdomains extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            subdomains: [],
            subdomain: {},
            subdomainsAddOpenModal: false
        }
    }

    componentDidMount() {
        //this.getDomainSubdomains(this.props.domainId)
        this.setState({subdomains: (this.props.domain != null ? (this.props.domain.subdomains ? this.props.domain.subdomains : []) : [])})
    }

    getDomainSubdomains = (domainId) => {
        const requestOptions = {
            method: 'GET',
        };
        fetch(API_BASE + ENDPOINTS.domains + "/" +  domainId + "/subdomains", requestOptions)
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
                    subdomains: data
                })
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }


    render() {
        return (
            <Modal
                basic
                centered={false}
                dimmer={"blurring"}
                onClose={() => this.props.setSubdomainsOpenModal(false)}
                open={this.props.subdomainsOpenModal}
                size='large'
            >
                <Modal.Header>{this.props.domainName} subdomains <br/><br/>
                    <Button color="green" inverted onClick={(e) => this.setDomainAddOpenModal(true)}><i className="plus icon"></i>Add
                        Subdomain</Button>
                </Modal.Header>
                <Modal.Content scrolling>
                    <table className="ui inverted table">
                        <thead>
                        <tr>
                            <th>Subdomain</th>
                            <th>Ports</th>
                            <th>Technologies</th>
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
                                <td>{subdomain.created_at}</td>
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
                        onClick={() => this.props.setSubdomainsOpenModal(false)}
                    />
                </Modal.Actions>

                <DomainsAdd domainsAddOpenModal={this.state.domainsAddOpenModal}
                            setDomainAddOpenModal={this.setDomainAddOpenModal}
                            getCompanyDomains={this.getCompanyDomains}
                            companyId={this.props.companyId}
                />

            </Modal>
        );
    }


}

export default DomainSubdomains;