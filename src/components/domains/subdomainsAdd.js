import React from "react";
import {Button, Form, Icon, Input, Modal} from "semantic-ui-react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import fetcher from "../../api/fetcher";

class SubdomainsAdd extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            subdomainName: "",
            isLoading: false
        }
    }

    handleSubdomainNameChange = (e) => {
        e.preventDefault()
        this.setState({
            subdomainName: e.target.value
        })
    }

    handleSubdomainAdd = (e) => {
        e.preventDefault()
        this.setState({
            isLoading: true
        })
        this.createNewSubdomain()
    }

    createNewSubdomain = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({subdomain_name: this.state.subdomainName + "." + this.props.domain.domain_name, domain_id: this.props.domainID})
        };
        fetcher(API_BASE + ENDPOINTS.domains + "/" + this.props.domainID + "/subdomains", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                this.setState({subdomainName: "", isLoading: false})
                this.props.getSubdomains(this.props.domainID)
                this.props.setSubdomainAddOpenModal(false)
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
                centered={false}
                dimmer={"blurring"}
                onClose={() => this.props.setSubdomainAddOpenModal(false)}
                open={this.props.subdomainsAddOpenModal}
                size='small'
            >
                <Modal.Header>
                    Add New Subdomain
                </Modal.Header>
                <Modal.Content>
                    <Input label={{ basic: true, content: '.' + this.props.domain.domain_name }}
                           labelPosition='right' placeholder='subdomain'
                           onChange={this.handleSubdomainNameChange} value={this.state.subdomainName}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={() => this.setDomainAddOpenModal(false)}>
                        <Icon name='remove'/> Cancel
                    </Button>
                    <Button color='green' loading={this.state.isLoading} inverted onClick={(e) => {
                        this.handleSubdomainAdd(e)
                    }}>
                        <Icon name='save'/> Save
                    </Button>
                </Modal.Actions>


            </Modal>
        );
    }


}

export default SubdomainsAdd;