import React, { Component } from 'react'
import Page2 from './Page2'
import { MyContext } from '../App'
export default class page1 extends Component {
    state = {
        showBtn: false,
        contentToBeShown: null
    }

    render() {
        return (
            <div className="container p-1 mt-5" style={{ width: "auto", border: "1px solid black" }}>
                {this.state.showBtn ?
                    <>
                        <ul className="list-group">
                            <button
                                type="button"
                                onClick={this.showBackBtn}
                                className="btn btn-outline-dark">
                                {`<- GO BACK  [ ${this.state.contentToBeShown} ]`}</button>
                            <Page2 category={this.state.contentToBeShown} />
                        </ul>
                    </>
                    :
                    <ul className="list-group">
                        <MyContext.Consumer>
                            {
                                items => (
                                    items.map(item => (
                                        <div className="card" key={item}>
                                            <button
                                                type="button"
                                                onClick={() => { this.showContent(item) }}
                                                className="card-body btn btn-outline-dark m-2">
                                                {item}
                                            </button>
                                        </div>
                                    ))
                                )
                            }
                        </MyContext.Consumer>
                    </ul>
                }
            </div>
        )
    }

    showBackBtn = () => {
        this.setState({
            showBtn: false,
            contentToBeShown: null
        })
    }

    showContent = (item) => {
        this.setState({
            showBtn: true,
            contentToBeShown: item
        })
    }
}
