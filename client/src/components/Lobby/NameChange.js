import React, { Component } from 'react';

class NameChange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          name: "Player 1",
          changeName: false,
        };
    
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleClick = event => {
        this.setState({ changeName: !this.state.changeName });
        event.preventDefault();
    }
    handleChange = event => {
        this.setState({
          name: event.target.value
        });
    }
    handleSubmit = event => {
        event.preventDefault();
        this.setState({ name: this.state.name, changeName: !this.state.changeName });
    }
    // getForm=(e)=>{
    //     return(
    //         <div>
    //             {this.state.changeName ? (
    //            <form onSubmit={this.handleSubmit}>
    //             <label>
    //               <input name="name" type="text"  onChange={this.handleChange} />
    //             </label>
    //             <input type="submit"/>
    //           </form>
    //             ) :null}
    //         </div>
    //     )
    // }

    render() {
        return (
          <div>
            {/* <h2 onClick={this.handleClick}>{this.state.name}</h2> */}
            <h2 onClick={this.handleClick}>{this.state.name}</h2>
            
            {this.state.changeName ? (
              <form onSubmit={this.handleSubmit}>
                <label>
                  <input name="name" type="text"  onChange={this.handleChange} />
                </label>
                <input type="submit"/>
              </form>
            ) : null}
          </div>
        );
      }
}

export default NameChange;