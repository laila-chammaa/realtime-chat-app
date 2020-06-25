import React from "react";
import ReactEmoji from "react-emoji";
import "./Message.css";

const Message = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false;
  //here name is the name of our current user while user
  //which we got from message is from the message sender
  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    //sent by current user
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundPurple">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    //sent by other users
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
