import React, {Component} from 'react';
import ConversationComponent from './ConversationComponent'
import ConversationsComponent from './ConversationsComponent'
import './messages.css'

class MessagesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {convoId: props.match.params.id}
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    this.setState({convoId: nextProps.match.params.id})
  }

  render() {
    return <div>
      <div className="messages-container">
        <ConversationsComponent/>
        <ConversationComponent convoId={this.state.convoId}/>
      </div>
    </div>
  }
}

export default MessagesComponent;