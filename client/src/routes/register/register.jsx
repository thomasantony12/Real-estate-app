import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {

    setError("");
    setIsLoading(true);

    e.preventDefault();
    

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    // console.log( username, password, email);
    try {
      setError("");
      const res = await apiRequest.post("auth/register", { username, password, email});
      console.log(res);
      navigate("/login");
    }catch (err){
      // console.log("failed to submitt", err);
      // console.log(err.response.data.message);
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" required minLength={5} maxLength={20} type="text" placeholder="Username" />
          <input name="email" required type="text" placeholder="Email" />
          <input name="password" required minLength={5} maxLength={20} type="password" placeholder="Password" />
          {error && <span>{error}</span>}
          <button disabled={isLoading} >Register</button>
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
