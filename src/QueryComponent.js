import React, { Component } from "react";
import PropTypes from "prop-types";
import queryAPI from "./queryAPI";
import { Button } from "react-bootstrap";

class ShowResultsFromAPI extends Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  // Used to set and reset the state after an answer
  getDefaultState() {
    return {
      apiQueryDelay: this.props.apiQueryDelay,
      queryMessage: "Get the Magic 8 ball answer",
      error: undefined,
      awaitingReset: false
    };
  }

  //  For people that are impatient, a way to disable the delay before we make the request
  onDisableDelay() {
    this.setState({
      apiQueryDelay: 0
    });
  }

  // Query the 8 ball for it's answer, We might delay if the user has not cancelled the delay yet
  queryData() {
    if (this.state.awaitingReset) {
      console.log("Patience grasshopper....");
      return;
    }

    if (this.state.apiQueryDelay) {
      const fetchData = this.fetchData.bind(this);
      this.setState({
        queryMessage: `Deferring the query for ${this.state.apiQueryDelay} ms`,
        apiQueryDelay: 0 // Because I didn't like that button staring at me when it was useless
      });
      console.log("Anticipation, Anticipation, it's making you wait....");
      setTimeout(function() {
        fetchData();
      }, this.state.apiQueryDelay);
    } else {
      this.fetchData();
    }
  }

  // Query the remote 8 ball server for it's answer.  Once it is recieved, update the display and set a 3 second timer
  //   to reset and allow the petitioner to ask another question
  fetchData() {
    console.log("Querying Endpoint");
    this.setState({
      queryMessage: "Awaiting Response"
    });

    queryAPI()
      .then(
        function(response) {
          if (response.data) {
            console.log("Got the response");
            this.setState({
              data: response.data,
              error: false,
              queryMessage: "All has been revealed",
              awaitingReset: true
            });
          }
        }.bind(this) // This is one way of binding so that this is the right this when the function is called
      )
      .then(() => {
        // And this is the other way of binding (using an arrow function)
        setTimeout(() => {
          this.setState(this.getDefaultState());
        }, 3000);
      });
  }

  getDisplayContent() {
    const error = this.state.error;
    if (error === undefined) {
      return <p>Ask the Magic 8 ball your question</p>;
    } else if (error) {
      return (
        <p style={{ color: "red" }}>
          Sorry - there was an error with your request.
        </p>
      );
    }
    return <p style={{ color: "green" }}>{this.state.data}</p>;
  }

  render() {
    var delayButton = null;

    // This isn't a toggle, so just hide the button once it has been clicked, a reset will restore it for next time
    // This section of the code uses .bind
    if (this.state.apiQueryDelay) {
      delayButton = (
        <Button onClick={this.onDisableDelay.bind(this)}>
          {`Disable request delay of ${this.state.apiQueryDelay} ms`}
        </Button>
      );
    }

    // And this uses an arrow function
    return (
      <div>
        <div className="content-container" ref="container">
          {this.getDisplayContent()}
        </div>
        {delayButton}
        <Button onClick={() => this.queryData()}>
          {this.state.queryMessage}
        </Button>
      </div>
    );
  }
}

// This isn't reallly needed unless you wanted to set the displayName to something else.
ShowResultsFromAPI.displayName = {
  name: "ShowResultsFromAPI"
};

ShowResultsFromAPI.defaultProps = {
  apiQueryDelay: 300
};
ShowResultsFromAPI.propTypes = {
  apiQueryDelay: PropTypes.number
};

export default ShowResultsFromAPI;
