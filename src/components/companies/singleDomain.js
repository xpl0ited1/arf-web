import React from "react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Form, Header, Icon, Modal} from "semantic-ui-react";
import queryString from "query-string";

class SingleDomain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            domainId:"",
            openModal: false,
            domain: {}
        }
    }

    componentDidMount() {
        let params = queryString.parse(document.location.search)
        if (params.domainId !== undefined) {
            this.setState({domainId: params.domainId})
            this.getDomain(params.domainId)
        }
    }

    setOpenModal = (set) => {
        this.setState({openModal: set})
    }

    getDomain = (domainId) => {
        const requestOptions = {
            method: 'GET',
        };
        fetch(API_BASE + ENDPOINTS.domains + "/" + domainId, requestOptions)
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
                    domain: data,
                    companyName: "",
                    reportingUrl: "",
                    companyId: ""
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
            <div className="main_content" id="main_content">

                <div className="ui divider"></div>
                <div className="three wide column">
                    <div className="twelve wide column home_content">
                        <h1>{this.state.domain.domain_name ? this.state.domain.domain_name: ""}</h1>

                        <div className="ui labeled icon buttons">

                            <Modal
                                basic
                                onClose={() => this.setOpenModal(false)}
                                onOpen={() => this.setOpenModal(true)}
                                open={this.state.openModal}
                                size='large'
                                trigger={<Button className="ui green inverted button"><i className="plus icon"></i>
                                    <a className="link_icon" style={{color: "whitesmoke"}} href="src/components/domains/domains#">Add Subdomain</a></Button>}
                            >
                                <Header icon>
                                    <Icon name='server'/>
                                    Add New Subdomain
                                </Header>
                                <Modal.Content>
                                    <Form inverted>
                                        <Form.Input fluid label='Subdomain Name' placeholder='subdomain.example.com'
                                                    onChange={this.handleCompanyNameChange}/>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button basic color='red' inverted onClick={() => this.setOpenModal(false)}>
                                        <Icon name='remove'/> Cancel
                                    </Button>
                                    <Button color='green' inverted onClick={(e) => {
                                        this.setOpenModal(false);
                                        this.handleSubmit(e)
                                    }}>
                                        <Icon name='save'/> Save
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SingleDomain;