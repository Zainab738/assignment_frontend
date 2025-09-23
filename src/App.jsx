import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Createpost from "./components/Createpost";
import Deletepost from "./components/Deletepost";
import EditPost from "./components/EditPost";
import Feed from "./components/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<Createpost />} />
        <Route path="/deletepost/:id" element={<Deletepost />} />
        <Route path="/editpost/:id" element={<EditPost />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
