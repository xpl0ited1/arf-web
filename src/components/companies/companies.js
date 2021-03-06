import React from 'react'
import {API_BASE, ENDPOINTS} from "../../api/constants";
import {Button, Form, Header, Icon, Input, Modal} from "semantic-ui-react";
import CompanyDomains from "./domains";
import fetcher from "../../api/fetcher";

class Companies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            openModal: false,
            companyName: "",
            reportingUrl: "",
            companyId: "",
            updateOpenModal: false,
            domainsOpenModal: false,
            company: {},
            isLoading: true,
            isSearching: false,
            loadingSave: false,
            loadingDelete: false
        }

        this.handleCompanyNameChange = this.handleCompanyNameChange.bind(this)
        this.handleReportingUrlChange = this.handleReportingUrlChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
        this.handleCompanyUpdate = this.handleCompanyUpdate.bind(this)
        this.handleCompanyDelete = this.handleCompanyDelete.bind(this)
        this.handleShowCompanyDomains = this.handleShowCompanyDomains.bind(this)
        this.handleCompanySearch = this.handleCompanySearch.bind(this)
    }

    componentDidMount() {
        this.getCompanies()
        this.props.checkLogin()
    }

    getCompanies = () => {
        const requestOptions = {
            method: 'GET'
        };
        fetcher(API_BASE + ENDPOINTS.companies, requestOptions)
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
                    companies: (data ? data : []),
                    companyName: "",
                    reportingUrl: "",
                    companyId: "",
                    company: {},
                    isLoading: false,
                    loadingSave: false,
                    loadingDelete: false
                })
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    getCompaniesWithCallback = (callback) => {
        const requestOptions = {
            method: 'GET'
        };
        fetcher(API_BASE + ENDPOINTS.companies, requestOptions)
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
                    companies: (data ? data : []),
                    companyName: "",
                    reportingUrl: "",
                    companyId: "",
                    company: {},
                    isLoading: false,
                    loadingSave: false,
                    loadingDelete: false
                })
                callback(data);
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    setOpenModal = (set) => {
        this.setState({openModal: set})
    }

    setOpenUpdateModal = (set) => {
        this.setState({updateOpenModal: set})
    }

    setDomainsOpenModal = (set) => {
        this.setState({domainsOpenModal: set})
    }

    handleCompanyNameChange = (e) => {
        this.setState({companyName: e.target.value})
    }

    handleReportingUrlChange = (e) => {
        this.setState({reportingUrl: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({loadingSave: true})
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetcher(API_BASE + ENDPOINTS.companies, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    this.setState({loadingSave: false})
                    return Promise.reject(error);
                }
                this.setOpenModal(false);
                this.getCompanies()
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    handleItemClick = (e, company) => {
        e.preventDefault()
        this.setState({
            companyName: company.company_name,
            reportingUrl: company.bounty_url,
            companyId: company.id,
            company: company
        })
        this.setState({updateOpenModal: true})
    }

    handleCompanyUpdate = (e) => {
        e.preventDefault()
        this.setState({loadingSave: true})
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetcher(API_BASE + ENDPOINTS.companies + "/" + this.state.companyId, requestOptions)
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
                this.setOpenUpdateModal(false);
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    handleCompanyDelete = (e) => {
        e.preventDefault()
        this.setState({loadingDelete: true})
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({company_name: this.state.companyName, bounty_url: this.state.reportingUrl})
        };

        fetcher(API_BASE + ENDPOINTS.companies + "/" + this.state.companyId + "/delete", requestOptions)
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
                this.setOpenUpdateModal(false)
            })
            .catch(error => {
                //TODO: Handle Errors
                this.setState({errorMessage: error.toString()});
                console.error('There was an error!', error);
            });
    }

    handleShowCompanyDomains = (e) => {
        e.preventDefault()
        this.setState({domainsOpenModal: true})
    }

    handleCompanySearch = (e) => {
        e.preventDefault()
        this.getCompaniesWithCallback((data) =>{
            /*let filtered = this.state.companies.filter((company) => {
                if (e.target.value === ""){
                    return company
                }else{
                    return company.company_name.toLowerCase().includes(e.target.value.toLowerCase())
                }
            })
            this.setState({
                companies: filtered
            })*/
            let filtered = []
            data.map((company, idx) => {
                if(company.company_name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1){
                    filtered.push(company)
                }
            })
            this.setState({
                companies: filtered
            })
        })


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
                                    Add</Button>}
                            >
                                <Header icon>
                                    <Icon name='building'/>
                                    Add New Company
                                </Header>
                                <Modal.Content>
                                    <Form inverted>
                                        <Form.Input fluid label='Company Name' placeholder='Hackmetrix'
                                                    onChange={this.handleCompanyNameChange}/>
                                        <Form.Input fluid label='Reporting URL' placeholder='https://www.hackmetrix.com'
                                                    onChange={this.handleReportingUrlChange}/>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button basic color='red' inverted onClick={() => this.setOpenModal(false)}>
                                        <Icon name='remove'/> Cancel
                                    </Button>
                                    <Button color='green' loading={this.state.loadingSave} inverted onClick={(e) => {
                                        this.handleSubmit(e)
                                    }}>
                                        <Icon name='save'/> Save
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </div>
                        <div>
                            <br />
                            <Input icon='search' placeholder='Search...' style={{width: "10vw"}} onChange={this.handleCompanySearch}/>
                        </div>
                        <table
                            className={this.state.isLoading ? "ui loading form inverted table" : "ui inverted table"}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Reporting URL</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.companies.map((company, idx) => {
                                return <tr key={idx}>
                                    <td className="selectable" style={{paddingLeft: "5px"}} onClick={(e) => {
                                        this.handleItemClick(e, company)
                                    }}>{company.company_name}</td>
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
                        <Icon name='building'/>
                        Update Company
                        <br/>
                    </Header>
                    <center><Button color='blue' inverted onClick={(e) => {
                        //this.setOpenUpdateModal(false);
                        this.handleShowCompanyDomains(e)
                    }}>
                        <Icon name='eye'/> View Company Assets
                    </Button></center>
                    <Modal.Content>
                        <Form inverted>
                            <Form.Input fluid label='Company Name' placeholder='Hackmetrix'
                                        onChange={this.handleCompanyNameChange} value={this.state.companyName}/>
                            <Form.Input fluid label='Reporting URL' placeholder='https://www.hackmetrix.com'
                                        onChange={this.handleReportingUrlChange} value={this.state.reportingUrl}/>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={() => this.setOpenUpdateModal(false)}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='red' loading={this.state.loadingDelete} inverted onClick={(e) => {
                            this.handleCompanyDelete(e)
                        }}>
                            <Icon name='remove'/> Delete this entry
                        </Button>
                        <Button color='green' loading={this.state.loadingSave} inverted onClick={(e) => {
                            this.handleCompanyUpdate(e)
                        }}>
                            <Icon name='save'/> Save
                        </Button>
                    </Modal.Actions>


                    <CompanyDomains setDomainsOpenModal={this.setDomainsOpenModal}
                                    domainsOpenModal={this.state.domainsOpenModal}
                                    companyName={this.state.companyName}
                                    companyId={this.state.companyId}
                                    company={this.state.company}
                                    token={this.props.token}
                    />

                </Modal>


            </div>
        );
    }


}

export default Companies;

