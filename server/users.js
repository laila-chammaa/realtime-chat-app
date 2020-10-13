const users = [];

const addUser = ({ id, name, room }) => {

  if (!name || !room) return { error: "Username and room are required." };

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //checking if there's already an existing room with that existing user which is forbidden
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    //change their name
    name = name + "." + id[3];
    id = id + id[4];
  }

  //else create the user
  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  //if no id found
  return null;
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom, users };
