import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const Root = ()=>{
  // check if token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");

  // redirect to dashboard if token exists , otherwise redirect to login 
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}

export default App;
