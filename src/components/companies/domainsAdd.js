import React from "react";
import {Button, Form, Icon, Modal} from "semantic-ui-react";
import {API_BASE, ENDPOINTS} from "../../api/constants";

class DomainsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domainName: ""
        }

        this.handleDomainAddForCompany = this.handleDomainAddForCompany.bind(this)
        this.handleDomainNameChange = this.handleDomainNameChange.bind(this)
    }

    handleDomainAddForCompany = (e) => {
        e.preventDefault()

        this.createNewDomain()
    }

    handleDomainNameChange = (e) => {
        e.preventDefault()

        this.setState({
            domainName: e.target.value
        })
    }

    createNewDomain = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": this.props.token},
            body: JSON.stringify({domain_name: this.state.domainName})
        };
        fetch(API_BASE + ENDPOINTS.companies + "/" + this.props.companyId + "/domains" , requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.setState({ domainName: "" })
                this.props.getCompanyDomains(this.props.companyId)
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }


    render() {
        return (
            <Modal
                centered={false}
                dimmer={"blurring"}
                onClose={() => this.props.setDomainAddOpenModal(false)}
                open={this.props.domainsAddOpenModal}
                size='small'
            >
                <Modal.Header>
                    Add New Domain
                </Modal.Header>
                <Modal.Content>
                    <Form.Input fluid label='Domain Name' placeholder='example.com'
                                onChange={this.handleDomainNameChange} value={this.state.domainName}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={() => this.setDomainAddOpenModal(false)}>
                        <Icon name='remove'/> Cancel
                    </Button>
                    <Button color='green' inverted onClick={(e) => {
                        this.props.setDomainAddOpenModal(false)
                        this.handleDomainAddForCompany(e)
                    }}>
                        <Icon name='save'/> Save
                    </Button>
                </Modal.Actions>


            </Modal>
        )
            ;
    }

}

export default DomainsAdd;