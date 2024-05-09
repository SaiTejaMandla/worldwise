// import React from 'react'

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/FakeAuthContext";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();

  const { isAuthorized } = useAuth();
  useEffect(
    function () {
      if (!isAuthorized) navigate("/");
    },
    [isAuthorized, navigate]
  );

  return isAuthorized ? children : null;
}
