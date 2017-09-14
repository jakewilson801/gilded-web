import React, {Component} from 'react';
import './conversation.css'

class ConversationComponent extends Component {
  datcMessages = ["Hey this is Stacy from DATC", "Nice to meet you Stacy, I'm Drew", "What programs interest you? Do you need any help?"];
  atkMessages = ["Hey this is John from ATK. What type of role are you looking for?.", "Thanks for getting back to me. I'm looking for anything in manufacturing.", "Awesome we are looking to fill for those roles."];
  messages = {1: this.datcMessages, 2: this.atkMessages};
  state = {currentMessage: "", currentInput: "", currentConvoId: "0"};
  shouldScrollBottom = false;

  constructor() {
    super();
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidUpdate() {
    let node = this.refs.messages;
    node.scrollTop = node.scrollHeight
  }

  componentWillUpdate() {
    let node = this.refs.messages;
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.convoId && nextProps.convoId !== "0") {
      this.setState({currentConvoId: nextProps.convoId});
    } else {
      this.setState({currentMessage: "Select a convo"});
    }
  }

  componentDidMount() {
    if (this.props.convoId && this.props.convoId !== "0") {
      this.setState({currentConvoId: this.props.convoId});
    } else {
      this.setState({currentMessage: "Select a convo"});
    }
  }

  handleSend() {
    let newMessage = this.state.currentInput;
    this.setState({currentInput: ""});
    if (this.state.currentConvoId === "1") {
      this.messages["1"].push(newMessage.trim());
    } else if (this.state.currentConvoId === "2") {
      this.messages["2"].push(newMessage.trim())
    }
  }

  handleMessageChange(event) {
    this.setState({currentInput: event.target.value})
  }

  makeid() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      let content = e.target.value;
      let caret = this.getCaret(e);
      if (e.shiftKey) {
        e.target.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
        e.stopPropagation();
      } else {
        e.target.value = content.substring(0, caret - 1) + content.substring(caret, content.length);
        e.preventDefault();
        this.handleSend();
      }
    }
  }

  getCaret(el) {
    if (el.selectionStart) {
      return el.selectionStart;
    } else if (document.selection) {
      el.focus();
      var r = document.selection.createRange();
      if (r == null) {
        return 0;
      }
      var re = el.createTextRange(), rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);
      return rc.text.length;
    }
    return 0;
  }

  render() {
    let currentMessages = this.messages[this.state.currentConvoId];
    let imageUrl = this.state.currentConvoId === "1" ? "/assets/datc.jpg" : "/assets/atk.jpg";
    let headerName = this.state.currentConvoId === "1" ? "DATC" : "ATK";
    let messageList;
    let convoImage;
    let convoName;
    if (currentMessages) {
      messageList = currentMessages.map(i => <div key={this.makeid()}
                                                  className={currentMessages.indexOf(i) % 2 === 1 ? "conversation-me" : "conversation-them"}>{i.split('\n').map((item, key) => {
        return <span key={key}>{item}<br/></span>
      })}</div>);
      convoImage = (<img src={imageUrl} className="conversation-avatar"/>);
      convoName = (<div className="conversation-name">{headerName}</div>);
    }
    return <div className="conversation-container">
      <div className="conversation-header">
        {convoImage || ""}
        {convoName || ""}
      </div>
      <div className="conversation-messages-container" ref="messages">
        {messageList || <h3 className="conversation-empty">Select a conversation to get started</h3>}
      </div>
      <div className="conversation-input-container">
        <textarea className="conversation-input"
                  onKeyPress={this.handleKeyPress}
                  value={this.state.currentInput}
                  placeholder="Reach out! Don't be shy"
                  onChange={this.handleMessageChange}/>
        <div onClick={this.handleSend} className="conversation-send-container">
          <div className="conversation-send-text">
            SEND
          </div>
        </div>
      </div>
    </div>
  }
}

export default ConversationComponent;