const DUMMY_DATA = [
  {
    senderId: "perborgen",
    text: "who'll win?"
  },
  {
    senderId: "janedoe",
    text: "who'll win?"
  }
]

const instanceLocator = "v1:us1:09d1b90c-7bfe-4257-825f-f2a0592cb2bb"
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/09d1b90c-7bfe-4257-825f-f2a0592cb2bb/token"
const username = "BElder"
const roomId = 5643

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      messages: DUMMY_DATA
    }
  }

  componentDidMount() {
    const chatManager = new Chatkit.chatManager({
      instanceLocator: instanceLocator,
      userId: username,
      tokenProvider: new Chatkit.tokenProvider({
        url: testToken
      })
    })

    chatManager.connect().then(currentUser => {
      currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            })
          }
        }
      })
    })
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: roomId
    })
  }

  render() {
    return (
      <div className="app">
        <Title />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
      </div>
    )
  }
}

class MessageList extends React.Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map(message => {
          return (
            <li key={message.id}>
              <div>
                {message.senderId}
              </div>
              <div>
                {message.text}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

class SendMessageForm extends React.Component {

  constructor() {
    super()
    this.state = {
       message: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.sendMessage(this.state.message)
    this.setState({
      message: ''
    })
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="send-message-form">
        <input
          onChange={this.handleChange}
          value={this.state.message}
          placeholder="Type your message and hit ENTER"
          type="text" />
      </form>
    )
  }
}

function Title() {
  return <p className="title">My awesome chat app</p>
}

ReactDOM.render(<App />, document.getElementById('root'));