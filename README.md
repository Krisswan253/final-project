# MEDP33100 - Final Project: Public Archive

## Live Demo

- https://forgotten-internet.onrender.com/
---

## Project Overview

Public Archive is an interactive digital archive centered around forgotten internet memories and online nostalgia. Users can submit memories connected to old websites, deleted videos, childhood games, usernames, internet friendships, or strange late-night browsing experiences that still linger in their minds years later.

The project explores the emotional relationship people have with the internet and how digital spaces become tied to memory, identity, comfort, grief, and nostalgia. Users can upload memories, attach images, browse archived posts, filter memories by feeling, leave comments, and interact with expanding popups that recreate the feeling of revisiting forgotten pieces of the web.

The overall visual style was inspired by old internet forums, Tumblr archives, digital archaeology, and forgotten online spaces.

---

## Endpoints

### `GET /entries`
Returns all archived memory entries from the database.

### `POST /entries`
Creates a new memory entry and stores it in MongoDB.

### `GET /entries/:id`
Returns a single memory entry based on its unique ID.

### `PUT /entries/:id`
Updates an existing memory entry.

### `DELETE /entries/:id`
Deletes a memory entry from the archive.

### `POST /entries/:id/comments`
Adds a new comment to a specific memory entry.

---

## Technologies Used

- **Languages**:
  - HTML
  - CSS
  - JavaScript

- **Libraries / Frameworks**:
  - Express.js
  - MongoDB
  - Mongoose
  - Multer

- **Other Tools**:
  - Render (deployment)
  - GitHub
  - Visual Studio Code
  - Inter Font by Rasmus Andersson
  - Youtube
  -Stack Overflow

---

## Credits

### Fonts
- Inter Font:
  - https://rsms.me/inter/

### Inspiration / References
- “Missed Connections NYC” https://missedyounyc.com/
- “Confession Post” https://www.confessionpost.com/
- “That damn notes app” (student project) https://final-project-notes-app.onrender.com/

- Old internet archive aesthetics inspired by:
  - Tumblr archives
  - early 2010s web forums
  - internet nostalgia communities
  - digital preservation projects

### Tutorials / Resources
- Express.js documentation:
  - https://expressjs.com/

- MongoDB documentation:
  - https://www.mongodb.com/docs/

- Mongoose documentation:
  - https://mongoosejs.com/docs/

- Multer documentation:
  - https://github.com/expressjs/multer

- MDN Web Docs:
  - https://developer.mozilla.org/

---

## Future Enhancements

- User accounts and saved profiles
- Ability to like or bookmark memories
- Search bar for keywords and years
- Audio uploads or ambient sounds attached to memories
- Animated transitions between archive entries
- Sorting by oldest/newest memories
- Memory “time capsule” mode where posts unlock after a certain amount of time
- Expanded tagging/filter systems
- Ability to upload GIFs or videos
- Interactive timeline view of internet memories over time