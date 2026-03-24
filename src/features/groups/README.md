# Group Feature Documentation

This feature manages complete group lifecycle including creation, student management, and scheduling.

## Files
- `groupSlice.js` - Redux slice defining state and reducers
- `groupAction.js` - Async thunks for group API operations
- `README.md` - This documentation

---

## 📌 State Properties

### Group Creation
- `errorAddGroupName` - Name validation error
- `errorAddGroupGrade` - Grade validation error
- `errorAddGroupDay` - Day validation error
- `errorAddGroupTime` - Time validation error
- `errorAddGroupPlace` - Place validation error
- `errorAddGroupPrice` - Price validation error
- `loadingGroup` - Creation loading state
- `errorAddGroup` - General creation error
- `loadingSuccessfully` - Creation success state

### Group List
- `loadingGetGroup` - List fetch loading
- `errorGetGroup` - List fetch error
- `groups` - Array of groups
- `pageGroups` - Current page number
- `totalPages` - Total pages available
- `totalGroups` - Total group count

### Single Group
- `loadingGetGroupById` - Single group fetch loading
- `errorGetGroupById` - Single group fetch error
- `GroupById` - Current group object

### Group Updates
- `loadingUpdateGroup` - Update loading state
- `errorUpdateGroup` - Update error
- `loadingSuccessfullyUpdate` - Update success state
- Field-specific validation errors (same as creation)

### Student Operations
- `loadingAddStudents` - Add students loading
- `errorAddStudents` - Add students error
- `loadingRemoveStudentFromGroup` - Remove student loading
- `errorRemoveStudentFromGroup` - Remove student error
- `loadingTransferStudent` - Transfer student loading
- `errorTransferStudent` - Transfer student error

---

## 📦 Async Actions (Redux Thunks)

This file contains all **Redux async actions (createAsyncThunk)** related to **Groups management** in the system.

It is responsible for handling all backend interactions related to groups and students inside groups.

---

## 📌 Responsibilities

* Create new groups
* Fetch groups list
* Fetch single group by ID
* Update group data
* Add students to a group
* Remove students from a group
* Transfer students between groups

All requests are authenticated using a token stored in `localStorage`.

---

## 🧠 Business Rules

* A student can belong to **only one group**
* Students already assigned to a group are excluded at the UI level
* Group ownership is validated on the backend using `teacherId`
* Transferring a student removes them from the old group and assigns them to the new one

---

## 🔗 API Integration

All actions communicate with the backend using a shared Axios instance:

```
api (axios instance)
```

Authentication:

* Token is sent in request headers

```
headers: { token: localStorage.getItem("token") }
```

---

## 📦 Available Async Actions

### 1️⃣ Create Group

```js
addGroup
```

Creates a new group using provided form data.

---

### 2️⃣ Get Groups

```js
getGroups
```

Fetches all groups.
Supports pagination and filters through dynamic URL parameters.

---

### 3️⃣ Get Group By ID

```js
getGroupById
```

Fetches a single group with:

* Students list
* Teacher data

---

### 4️⃣ Update Group

```js
updateGroupById
```

Updates group information such as:

* Name
* Schedule
* Price
* Other metadata

---

### 5️⃣ Add Students To Group

```js
addStudentsToGroup
```

Adds multiple existing students to a specific group.

✅ Only students without `groupId` should be sent
❌ Students already in groups are excluded in the UI

---

### 6️⃣ Remove Student From Group

```js
removeStudentFromGroup
```

Removes a student from a group and clears the student's `groupId`.

---

### 7️⃣ Transfer Student Between Groups

```js
transferStudent
```

Moves a student from one group to another.

Used when:

* Student changes schedule
* Student changes teacher
* Group restructuring

---

## ⚠️ Error Handling

* Backend error messages are forwarded using `rejectWithValue`
* A fallback message is provided for unexpected errors
* Errors are handled inside Redux slices and shown in the UI

---

## 🧩 Related Redux Slices

* `groupSlice`
* `studentSlice`

These slices handle loading, success, and error states for the async actions defined here.

---

## 🚀 Future Improvements

* Add optimistic UI updates
* Centralize token handling using interceptors
* Improve error typing
* Add unit tests for async actions

---

## ✍️ Notes

This file focuses only on **data fetching and mutation logic**.
UI logic, filtering, and selection handling are implemented in React components.

---

**Author:** Salah Ramadan
**Module:** Groups & Students Management
