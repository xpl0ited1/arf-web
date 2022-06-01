import React from "react";
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Form, Header, Icon, Modal, Select} from "semantic-ui-react";

class Domains extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            domains: [],
            companies: [],
            isFormLoading: false,
            companyId: "",
            domainName: "",
            domain: {},
            updateOpenModal: false
        }
        this.handleCompanySelectChange = this.handleCompanySelectChange.bind(this)
        this.handleDomainNameChange = this.handleDomainNameChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.getDomains()
    }

    getCompanies = () => {
        this.setState({isFormLoading: true})
        const requestOptions = {
            method: 'GET',
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

                this.setState({companies: data, isFormLoading: false})
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    getDomains = () => {
        const requestOptions = {
            method: 'GET',
        };
        fetch(API_BASE + ENDPOINTS.domains, requestOptions)
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
                    domains: data
                })
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    setOpenModal = (set) => {
        this.setState({
            openModal: set
        })

        if (set === true){
            this.getCompanies()
        }
    }

    getSelectCompanies = () => {
        let data = []
        this.state.companies.map((company, idx) => {
            let obj = {
                key: idx, text: company.company_name, value: company.id
            }
            data.push(obj)
        })
        return data
    }

    handleCompanySelectChange = (e, {value}) => {
        e.preventDefault()
        this.setState({
            companyId: value
        })
    }

    handleDomainNameChange = (e) => {
        e.preventDefault()
        this.setState({
            domainName: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.createNewDomain()
    }

    createNewDomain = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({domain_name: this.state.domainName, company_id: this.state.companyId})
        };
        fetch(API_BASE + ENDPOINTS.domains , requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.setState({ domainName: "", companyId: "" })
                this.getDomains()
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    handleItemClick = (e, domain) => {
        e.preventDefault()
        this.getCompanies()
        this.setState({domain: domain, domainName: domain.domain_name, companyId: domain.company_id})
        this.setState({updateOpenModal: true})
    }

    setOpenUpdateModal = (set) => {
        this.setState({
            updateOpenModal: set
        })
    }

    render() {
        return (
            <div className="main_content" id="main_content">

                <div className="ui divider"></div>
                <div className="three wide column">
                    <div className="twelve wide column home_content">
                        <h1>Domains</h1>

                        <div className="ui labeled icon buttons">

                            <Modal
                                basic
                                dimmer="blurring"
                                onClose={() => this.setOpenModal(false)}
                                onOpen={() => this.setOpenModal(true)}
                                open={this.state.openModal}
                                size='small'
                                trigger={<Button className="ui green inverted button"><i className="plus icon"></i>
                                    <a className="link_icon" style={{color: "whitesmoke"}} href="#">Add</a></Button>}
                            >
                                <Header icon>
                                    <Icon name='sitemap'/>
                                    Add Domain
                                </Header>
                                <Modal.Content>
                                    <Form inverted loading={this.state.isFormLoading}>
                                        <Form.Input fluid label='Domain Name' placeholder='Hackmetrix'
                                                    onChange={this.handleDomainNameChange} value={this.state.domainName}/>
                                        <Form.Field
                                            control={Select}
                                            options={this.getSelectCompanies()}
                                            label={{ children: 'Company', htmlFor: 'form-select-control-companies' }}
                                            placeholder='Company'
                                            search
                                            searchInput={{ id: 'form-select-control-companies' }}
                                            onChange={this.handleCompanySelectChange}
                                        />
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
                        <table className="ui inverted table">
                            <thead>
                            <tr>
                                <th>Domain Name</th>
                                <th>Added On</th>
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
                        <Icon name='sitemap'/>
                        Update Domain
                        <br/>
                    </Header>
                    <center><Button color='blue' inverted onClick={(e) => {
                        //this.setOpenUpdateModal(false);
                        this.handleShowCompanyDomains(e)
                    }}>
                        <Icon name='eye'/> View Subdomains
                    </Button></center>
                    <Modal.Content>
                        <Form inverted loading={this.state.isFormLoading}>
                            <Form.Input fluid label='Domain Name' placeholder='Hackmetrix'
                                        onChange={this.handleDomainNameChange} value={this.state.domainName}/>
                            <Form.Field
                                control={Select}
                                options={this.getSelectCompanies()}
                                label={{ children: 'Company', htmlFor: 'form-select-control-companies' }}
                                placeholder='Company'
                                search
                                searchInput={{ id: 'form-select-control-companies' }}
                                onChange={this.handleCompanySelectChange}
                                value={this.state.companyId}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={() => this.setOpenUpdateModal(false)}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='red' inverted onClick={(e) => {
                            this.setOpenUpdateModal(false);
                            this.handleCompanyDelete(e)
                        }}>
                            <Icon name='remove'/> Delete this entry
                        </Button>
                        <Button color='green' inverted onClick={(e) => {
                            this.setOpenUpdateModal(false);
                            this.handleCompanyUpdate(e)
                        }}>
                            <Icon name='save'/> Save
                        </Button>
                    </Modal.Actions>

                </Modal>



            </div>
        );
    }

}

export default Domains;