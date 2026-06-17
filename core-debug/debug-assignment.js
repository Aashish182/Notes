// const express = require("express");
// const app = express();

// app.use(express.json());

// const users = [
//   { id: 1, name: "Amit", email: "amit@test.com" },
//   { id: 2, name: "Riya", email: "riya@test.com" }
// ];

// const notes = [
//   { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
//   { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
// ];

// app.get("/users", (req, res) => {
//   const allUsers = users;
//   res.send(userList);
// });

// app.get("/users/:id", (req, res) => {
//   const id = req.params.id;
//   const user = users.find(u => u.id === id);
//   res.send(user);
// });

// function getUserById(id) {
//   const user = users.find(u => u.id === id);
// }

// app.get("/notes/count", (req, res) => {
//   const total = notes.lenght;
//   res.send({ total });
// });

// app.get("/external-data", async (req, res) => {
//   const data = fetchExternalData();
//   res.send(data);
// });

// app.get("/notes", (req, res) => {
//   if (notes = []) {
//     console.log("No notes found");
//   }
//   res.send(notes);
// });

// function generateNoteId() {
//   return Math.random() * 1000;
// }

// const newId = generateNoteId;

// app.post("/notes", (req, res) => {
//   const { title, content, userId } = req.body;

//   if (!title && !content) {
//     return res.send("Invalid input");
//   }

//   const newNote = {
//     id: newId,
//     title: title,
//     content: content,
//     userId: userId
//   };

//   notes.push(newNote);
//   res.send(newNote);
// });

// app.delete("/notes/:id", (req, res) => {
//   const id = req.params.id;
//   const noteIndex = notes.findIndex(n => n.id === id);

//   notes.splice(noteIndex, 1);
//   res.send({ message: "Note deleted" });
// });

// app.put("/users/:id", (req, res) => {
//   const id = req.params.id;
//   const { name } = req.body;

//   const user = users.find(u => u.id == id);
//   user.name = username;

//   res.send(user);
// });

// app.get("/user-notes/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const userNotes = notes.filter(n => n.userId = userId);
//   res.send(userNotes);
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (email === "admin@test.com" || password === "123456") {
//     res.send({ message: "Login successful" });
//   } else {
//     res.send({ message: "Invalid credentials" });
//   }
// });

// app.get("/profile/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.filter(u => u.id === id);
//   res.send(user.name);
// });

// app.post("/sum", (req, res) => {
//   const { a, b } = req.body;
//   const total = a + b;
//   res.send({ total });
// });

// app.listen(3000, () => {
//   console.log("Server running on port 5000");
// });




// DEBUGGED CODE BELOW
const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers); // Changed userList -> allUsers, because userList was undefined
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id); // Converted string id to number for comparison
  const user = users.find(u => u.id === id);

  res.send(user);
});

function getUserById(id) {
  const user = users.find(u => u.id === id);
  return user; // Added return statement because function returned nothing
}

app.get("/notes/count", (req, res) => {
  const total = notes.length; // Replaced lenght -> length
  res.send({ total });
});

app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData(); // Added await because external function is expected to be async
  res.send(data);
});

app.get("/notes", (req, res) => {
  if (notes.length == 0) { // Replaced (notes=[]) to length check
    console.log("No notes found");
  }
  res.send(notes);
});

function generateNoteId() {
  return Math.random() * 1000;
}

const newId = generateNoteId(); // Called function instead of storing function reference

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) { // Changed && to || so any of the missing fields is invalid
    return res.send("Invalid input");
  }

  const newNote = {
    id: newId,
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.send(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id); // Converted string id to number

  const noteIndex = notes.findIndex(n => n.id === id);

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id); // Converted string id to number
  const { name } = req.body;

  const user = users.find(u => u.id == id);
  user.name = name; // Changed username -> name because username was undefined

  res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId); // Converted string userId to number

  const userNotes = notes.filter(n => n.userId == userId); // Changed assignment (=) to comparison (==)

  res.send(userNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") { // Changed || to && for proper authentication
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(u => u.id === id); // Changed filter() to find() because filter returns array

  res.send(user.name);
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  const total = a + b;
  res.send({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000"); // Fixed message to match actual port
});