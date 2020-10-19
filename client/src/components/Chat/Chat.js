import React, { useState, useEffect } from "react";
//to retrieve data from the url
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar.js";
import Input from "../Input/Input.js";
import Messages from "../Messages/Messages.js";
import TextContainer from "../TextContainer/TextContainer.js";

let socket;

const Chat = ({ location }) => {
  const ENDPOINT = "https://laila-chat-app.herokuapp.com";
  //const ENDPOINT = "localhost:5000";

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  //a state to store one message, the most recent one
  const [message, setMessage] = useState("");
  //a state array to store all messages
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  //useEffect for "join"
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // return () => {
    //   socket.emit("disconnect");
    //   socket.off();
    // };
  }, [ENDPOINT, location.search]);

  //useEffect for "message" and "roomData"
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  //function for sending messages
  const sendMessage = (event) => {
    if (message) {
      //preventing key or button press so that the page doesn't refresh
      event.preventDefault();
      // the callback function just clears the message state to an empty string
      socket.emit("sendMessage", message, () => setMessage(""));
    } else {
      event.preventDefault();
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
