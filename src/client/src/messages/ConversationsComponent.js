import React, {Component} from 'react';
import './conversations.css'
import {Link} from 'react-router-dom';

class ConversationsComponent extends Component {
  render() {
    return <div className="conversations-container">
      <h2 className="conversations-header">Inbox</h2>
      <Link to="/messages/1">
        <div className="conversations-item">
          <img src="/assets/datc.jpg" className="conversations-avatar" alt="avatar"/>
          <div className="conversations-sender-container">
            <div className="conversations-sender">DATC</div>
            <div className="conversations-message">Thanks for reaching out! Let's figure out what you should study</div>
          </div>
        </div>
      </Link>
      <Link to="/messages/2">
        <div className="conversations-item">
          <img src="/assets/atk.jpg" alt="avatar" className="conversations-avatar"/>
          <div className="conversations-sender-container">
            <div className="conversations-sender">Orbital ATK</div>
            <div className="conversations-message">Hey great to hear from you how are you doing the thing right now </div>
          </div>
        </div>
      </Link>
    </div>
  }
}

export default ConversationsComponent;