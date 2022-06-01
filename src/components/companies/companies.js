import React from 'react'
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Form, Header, Icon, Modal} from "semantic-ui-react";

class Companies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            openModal: false,
            companyName: "",
            reportingUrl: "",
            companyId: "",
            updateOpenModal: false
        }

        this.handleCompanyNameChange = this.handleCompanyNameChange.bind(this)
        this.handleReportingUrlChange = this.handleReportingUrlChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
        this.handleCompanyUpdate = this.handleCompanyUpdate.bind(this)
        this.handleCompanyDelete = this.handleCompanyDelete.bind(this)
    }

    componentDidMount() {
        this.getCompanies()
    }

    getCompanies = () => {
        const requestOptions = {
            method: 'GET',
        };
        fetch(API_BASE+ENDPOINTS.companies, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.setState({companies:data,companyName: "",reportingUrl: "",companyId: ""})
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    setOpenModal = (set) => {
        this.setState({openModal: set})
    }

    setOpenUpdateModal = (set) => {
        this.setState({updateOpenModal: set})
    }

    handleCompanyNameChange = (e) => {
        this.setState({companyName: e.target.value})
    }

    handleReportingUrlChange = (e) => {
        this.setState({reportingUrl: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetch(API_BASE + ENDPOINTS.companies, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.getCompanies()
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    handleItemClick = (e, company) => {
        e.preventDefault()
        this.setState({companyName: company.company_name,reportingUrl: company.bounty_url, companyId: company.id})
        this.setState({updateOpenModal:true})
    }

    handleCompanyUpdate = (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetch(API_BASE + ENDPOINTS.companies + "/" + this.state.companyId, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.getCompanies()
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    handleCompanyDelete = (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetch(API_BASE + ENDPOINTS.companies + "/" + this.state.companyId + "/delete", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.getCompanies()
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }




    render() {
        return (
            <div className="main_content" id="main_content">

                <div className="ui divider"></div>
                <div className="three wide column">
                    <div className="twelve wide column home_content">
                        <h1>Companies</h1>
                        <div className="ui labeled icon buttons">

                            <Modal
                                basic
                                onClose={() => this.setOpenModal(false)}
                                onOpen={() => this.setOpenModal(true)}
                                open={this.state.openModal}
                                size='large'
                                trigger={<Button className="ui green inverted button"><i className="plus icon"></i>
                                    <a className="link_icon" style={{color: "whitesmoke"}} href="#">Add</a></Button>}
                            >
                                <Header icon>
                                    <Icon name='building' />
                                    Add New Company
                                </Header>
                                <Modal.Content>
                                    <Form inverted>
                                        <Form.Input fluid label='Company Name' placeholder='Hackmetrix' onChange={this.handleCompanyNameChange}/>
                                        <Form.Input fluid label='Reporting URL' placeholder='https://www.hackmetrix.com' onChange={this.handleReportingUrlChange}/>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button basic color='red' inverted onClick={() => this.setOpenModal(false)}>
                                        <Icon name='remove' /> Cancel
                                    </Button>
                                    <Button color='green' inverted onClick={(e) => {this.setOpenModal(false); this.handleSubmit(e)}}>
                                        <Icon name='save' /> Save
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </div>
                        <table className="ui inverted table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Reporting URL</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.companies.map((company, idx) => {
                                return <tr key={idx}>
                                    <td className="selectable" style={{paddingLeft:"5px"}} onClick={(e) => {this.handleItemClick(e, company)}} >{company.company_name}</td>
                                    <td>{company.bounty_url}</td>
                                </tr>
                            })}
                            </tbody>
                        </table>


                    </div>
                </div>






                <Modal
                    basic
                    onClose={() => this.setOpenUpdateModal(false)}
                    onOpen={() => this.setOpenUpdateModal(true)}
                    open={this.state.updateOpenModal}
                    size='small'
                >
                    <Header icon>
                        <Icon name='archive' />
                        Update Company
                        <br/>
                    </Header>
                    <center><Button color='blue' inverted onClick={() => this.setOpenUpdateModal(false)}>
                        <Icon name='eye' /> View Company Assets
                    </Button></center>
                    <Modal.Content>
                        <Form inverted>
                            <Form.Input fluid label='Company Name' placeholder='Hackmetrix' onChange={this.handleCompanyNameChange} value={this.state.companyName}/>
                            <Form.Input fluid label='Reporting URL' placeholder='https://www.hackmetrix.com' onChange={this.handleReportingUrlChange} value={this.state.reportingUrl}/>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={() => this.setOpenUpdateModal(false)}>
                            <Icon name='remove' /> Cancel
                        </Button>
                        <Button  color='red' inverted onClick={(e) => {this.setOpenUpdateModal(false); this.handleCompanyDelete(e)}}>
                            <Icon name='remove' /> Delete this entry
                        </Button>
                        <Button color='green' inverted onClick={(e) => {this.setOpenUpdateModal(false);this.handleCompanyUpdate(e)}}>
                            <Icon name='save' /> Save
                        </Button>
                    </Modal.Actions>
                </Modal>


            </div>
        );
    }


}

export default Companies;

