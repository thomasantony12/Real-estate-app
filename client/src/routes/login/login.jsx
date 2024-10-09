import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);

  const navigate = useNavigate();

  async function handleSubmit(e) {

    setError("");
    setIsLoading(true);

    e.preventDefault();
    

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");
    // console.log( username, password, email);
    try {
      setError("");
      const res = await apiRequest.post("auth/login", { username, password});
      updateUser(res.data);
      // console.log(res.data);
      navigate("/");
    }catch (err){
      // console.log("failed to submit", err);
      setError(err.response.data.message);
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={5} maxLength={20} type="text" placeholder="Username" />
          <input name="password" required minLength={5} maxLength={20} type="password" placeholder="Password" />
          {error && <span>{error}</span>}
          <button disabled={isLoading}>Login</button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
