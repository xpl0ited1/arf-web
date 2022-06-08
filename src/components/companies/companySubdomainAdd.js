import React from "react";
import {Button, Form, Header, Icon, Input, Modal} from "semantic-ui-react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import fetcher from "../../api/fetcher";

class CompanySubdomainAdd extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            subdomainName: "",
            isLoading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSubdomainNameChange = this.handleSubdomainNameChange.bind(this)
    }

    handleSubdomainNameChange = (e) => {
        e.preventDefault()
        this.setState({subdomainName: e.target.value})
    }

    handleSubmit  = (e) => {
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
                this.props.setSubdomainAddModalOpen(false)
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
                onClose={() => this.props.setSubdomainAddModalOpen(false)}
                onOpen={() => this.props.setSubdomainAddModalOpen(true)}
                open={this.props.open}
                size='large'
                trigger={<Button className="ui green inverted button"><i className="plus icon"></i>
                    Add Subdomain</Button>}
            >
                <Header icon>
                    <Icon name='server'/>
                    Add New Subdomain
                </Header>
                <Modal.Content>
                    <Form inverted>
                        <Input label={{ basic: true, content: '.' + this.props.domain.domain_name }}
                                    labelPosition='right' placeholder='subdomain'
                                    onChange={this.handleSubdomainNameChange} value={this.state.subdomainName} style={{
                                        marginLeft: "34%", textAlign: "right"
                        }}/>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => this.props.setSubdomainAddModalOpen(false)}>
                        <Icon name='remove'/> Cancel
                    </Button>
                    <Button color='green' loading={this.state.isLoading} inverted onClick={(e) => {
                        this.handleSubmit(e)
                    }}>
                        <Icon name='save'/> Save
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }


}

export default CompanySubdomainAdd;