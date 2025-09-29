import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Createpost from "./components/Createpost";
import Deletepost from "./components/Deletepost";
import EditPost from "./components/EditPost";
import Feed from "./components/Feed";
import Followers from "./components/Followers";
import Following from "./components/Following";
import Navbar from "./components/Navbar";

function Layout() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<Createpost />} />
        <Route path="/deletepost/:id" element={<Deletepost />} />
        <Route path="/editpost/:id" element={<EditPost />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Following />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
