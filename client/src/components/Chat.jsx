import React, {Component} from 'react';
import {Comment, Avatar, Form, Button, List, Input, Layout} from 'antd';

const {Content} = Layout;
const {TextArea} = Input;
const UUID = '772c9859-4dd3-4a0d-b87d-d76b9f43cfa4';

const CommentList = ({messages}) => {
  return (
    <List
      dataSource={messages.map(x => ({
        ...x,
        content: <div dangerouslySetInnerHTML={{__html: x.content}}/>
      }))}
      header={`${messages.length} ${messages.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} />}
    />
  )
};

const Editor = ({onChange, onSubmit, onClear, submitting, value}) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value}/>
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Send
      </Button>
      <Button style={{float: 'right'}} onClick={onClear} type="primary">
        All clear
      </Button>

    </Form.Item>
  </div>
);


class Chat extends Component {
  state = {
    messages: [],
    submitting: false,
    value: '',
    cuid: localStorage.getItem('cuid') || null
  };
  clear = () => {
    localStorage.clear();
    this.setState(
      {
        messages: [],
        cuid: null
      })
  };

  componentDidMount = async () => {
    this.setState({messages: await JSON.parse(localStorage.getItem('messages')) || []})
  };

  handleSubmit = async key => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true
    });
    if (!this.state.cuid) {
      const response = await fetch("api/init", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          'uuid': UUID,

        })
      });
      let result = await response.json();
      await this.setState({cuid: result.result.cuid});
      localStorage.setItem('cuid', result.result.cuid)

    }
    const response = await fetch("api/request", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        "cuid": this.state.cuid,
        "text": this.state.value

      })
    });
    let result = await response.json();


    await this.setState({
      value: '',
      messages: [
        ...this.state.messages,
        {
          author: 'Вы',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: `<p>${this.state.value}</p>`
        }
      ],
    });
    await this.setState({
        submitting: false,
        messages: [
          ...this.state.messages,
          {
            author: 'Бот Наносемантика',
            avatar: 'https://webim.ru/wp-content/uploads/2018/05/logo-og.png',
            content: `<p>${result.response}</p>`//<p dangerouslySetInnerHTML={{__html: result.result.result.text.value}}/>
          }
        ]
      }
    );
    localStorage.setItem('messages', JSON.stringify(this.state.messages))
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const {messages, submitting, value} = this.state;
    return (
      <div>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 50,
            minHeight: 280,
          }}
        >
          {messages.length > 0 && <CommentList messages={messages}/>}
          <Comment
            avatar={
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            }
            content={
              <Editor
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                onClear={this.clear}
                submitting={submitting}
                value={value}
              />
            }
          />
        </Content>

      </div>
    );
  }
}

export default Chat;