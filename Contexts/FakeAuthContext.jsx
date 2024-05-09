import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
};
const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthorized: false,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthorized: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthorized: false,
      };
    default:
      throw new Error("Unknown Action Type");
  }
};

function FakeAuthProvider({ children }) {
  const [{ user, isAuthorized }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthorized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("You are using before only");
  return context;
}

export { FakeAuthProvider, useAuth };
