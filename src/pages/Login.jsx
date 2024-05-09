import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/FakeAuthContext";
import PageNav from "../Components/PageNav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../Components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthorized } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  }

  useEffect(
    function () {
      if (isAuthorized) {
        navigate("/app");
      }
    },
    [isAuthorized, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onClick={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}
