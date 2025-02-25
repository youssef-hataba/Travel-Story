import {useNavigate} from "react-router";
import PasswordInput from "../../components/Input/PasswordInput";
import {useState} from "react";
import {validateEmail} from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");


    //Login API Call 
    try{
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("An error occurred while trying to login");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"></div>

      <div className="container h-screen flex items-center justify-center px-20 w-[80%] mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-cyan-100 font-semibold leading-[58px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-[15px] text-cyan-200 leading-6 pr-7 mt-4">
              Record your travel experiences and memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/40">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({target}) => {
                setEmail(target.value);
              }}
            />

            <PasswordInput
              value={password}
              onChange={({target}) => {
                setPassword(target.value);
              }}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              LOGIN
            </button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => {
                navigate("/signUp");
              }}>
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
