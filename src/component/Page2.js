import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Style.css'

export default class page2 extends React.Component {
    state = {
        books: [],                      // INITIAL ARRAY STATE.
        page: 1,                        // INITIAL PAGE STARTS WITH 1.
        per_page: 32,                   // DATA TO BE FETCHED PER API CALL.
        count: 0,                       // TOTAL ROWS PRESENT IN YOUR DB, NUMBER OF ROWS TO BE FETCHED.
        isLoading: false,               // MONITOR THE LOADING STATUS.
        errors: null,
        search: '',
        searchUrl: false,
        category: this.props.category                // SET TO TRUE IF THERE'S ANY ERROR'S
    }

    async componentDidMount() {
        const { page, category } = this.state;
        let url = `http://skunkworks.ignitesol.com:8000/books?topic=${category.toLowerCase()}&&page=${page}`;
        await this.FETCH_DATA_FROM_API(url);        // FIRTS API CALL AFTER DOM GOT RENDERED.
    }

    FETCH_DATA_FROM_API = (url) => {
        console.log('MAKING API CALL : ', url);
        this.setState({
            isLoading: true,
        }, async () => {
            // SET_STATE CALL BACK IS USED, IT WILL FIRST SET ISLOADING TO TRUE THEN PERFORM API CALL IN ACTION.
            try {
                const result = await axios.get(url);
                if (result) {
                    // IF RESULT THEN UPDATE STATE BASED ON THE PREVIOUS STATE.
                    return this.setState((prevState) => {
                        return {
                            books: [...prevState.books, ...result.data.results],
                            page: prevState.page + 1,
                            isLoading: false,
                            count: prevState.count + prevState.per_page,
                            errors: null
                        }
                    })
                }
            } catch (error) {
                toast.warn('NO MORE DATA !');
                this.setState({
                    errors: error,
                    isLoading: false,
                })
            }
        })
    }
    submitSearch = event => {
        event.preventDefault();
        if (this.state.search === this.state.category) {
            return toast.warn('You are searching same category again !')
        }
        this.setState({
            books: [],
            errors: null,
            page: 1,                        // INITIAL PAGE STARTS WITH 1.
            per_page: 32,                   // DATA TO BE FETCHED PER API CALL.
            count: 0,                       // TOTAL ROWS PRESENT IN YOUR DB, NUMBER OF ROWS TO BE FETCHED.
            isLoading: false,               // MONITOR THE LOADING STATUS.
            searchUrl: this.state.search === '' ? false : true
        }, () => {
            const { page, category, search } = this.state;
            let url = `http://skunkworks.ignitesol.com:8000/books?search=${search}&&topic=${category.toLowerCase()}&&page=${page}`;
            !this.state.isLoading && this.FETCH_DATA_FROM_API(url);
        })
    }
    clearSearch = e => {
        const { category, search } = this.state;
        if (search !== '') {
            this.setState({
                books: [],
                page: 1,                        // INITIAL PAGE STARTS WITH 1.
                per_page: 32,                   // DATA TO BE FETCHED PER API CALL.
                count: 0,
                searchUrl: false,
                search: ''
            }, () => {
                let url = `http://skunkworks.ignitesol.com:8000/books?topic=${category.toLowerCase()}&&page=${1}`;
                !this.state.isLoading && this.FETCH_DATA_FROM_API(url);
            })
        }
    }

    assignValues = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleScroll = e => {
        let element = e.target
        if (element.scrollHeight - element.scrollTop === element.offsetHeight) {
            // FIRST WILL CKECK IS PREVIOUS API STILL IN ACTION ? IF NO THEN FETCHING IS DONE ELSE NOTHING WILL BE PERFORMED.
            const { page, category, searchUrl, search } = this.state;
            let url = searchUrl ?
                `http://skunkworks.ignitesol.com:8000/books?search=${search}&&topic=${category.toLowerCase()}&&page=${page}
            `:
                `http://skunkworks.ignitesol.com:8000/books?topic=${category.toLowerCase()}&&page=${page}`;

            !this.state.isLoading && this.FETCH_DATA_FROM_API(url);
        }
    }

    render() {
        return (
            <React.Fragment>
                <React.Fragment>
                    <nav className="navbar navbar-light bg-light">
                        <a className="navbar-brand">Scroll all the way to bottom to fetch more data</a>
                        <form onSubmit={this.submitSearch} className="form-inline my-2 my-lg-0">
                            <input
                                className="form-control mr-sm-2"
                                type="text"
                                name="search"
                                value={this.state.search}
                                required
                                placeholder={this.state.search}
                                onChange={this.assignValues}
                            />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                        <button
                            className="btn btn-outline-dark mr-1"
                            onClick={this.clearSearch}
                            type="submit">Clear Search</button>
                    </nav>
                </React.Fragment>
                <React.Fragment>
                    <div className="jumbotron" >
                        <div className="scrollDiv" onScroll={this.handleScroll}>
                            <ul className="list-unstyled">
                                {this.state.books.length > 0 ? this.state.books.map(results => (
                                    <div className="mt-1" key={results.id}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="media">
                                                    <img
                                                        alt="404"
                                                        src={results.formats["image/jpeg"] !== undefined
                                                            ? results.formats["image/jpeg"]
                                                            //  ADDING AN IMAGE NOT FOUND URL IF THERE'S NO IMAGE
                                                            : `https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png`}
                                                        className="image"
                                                    />
                                                    <div >
                                                        <h6 className="card-subtitle mb-2 text-muted mt-2">Book Title :-</h6>
                                                        <h5 className="mt-0">{results.title}</h5>
                                                    </div>
                                                </div>
                                                <a rel="noopener noreferrer" target="_blank" href={
                                                    results.formats["text/plain"] !== undefined
                                                        ? results.formats["text/plain"]
                                                        : results.formats["text/html; charset=iso-8859-1"] !== undefined ? results.formats["text/html; charset=iso-8859-1"] : null


                                                } className="card-link">READING LINK : {
                                                        results.formats["text/plain"] !== undefined
                                                            ? results.formats["text/plain"]
                                                            : results.formats["text/html; charset=iso-8859-1"] !== undefined ? results.formats["text/html; charset=iso-8859-1"] : null
                                                    } </a>
                                                <hr />
                                                <h6 className="card-subtitle mb-2 text-muted">{results.authors.length > 0 ? "  By : " + results.authors[0].name : "  By : Unknown"}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                    : <div><p>NOTHING TO SHOW.</p></div>
                                }
                            </ul>
                            <button className="btn btn-primary m-1" type="button" disabled={true} >
                                {this.state.isLoading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : null}
                                {this.state.isLoading ? 'Fetching please wait...' : 'NOTHING FOUND.'}
                                {this.state.errors !== null ? 'ERROR OCCURED ' : null}
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            </React.Fragment >
        )
    }
}