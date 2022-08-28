import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../hooks/storeHooks";

const Dashboard = () => {
  const userToken = useAppSelector((state) => state.user.token_id);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) navigate("/");
  }, [userToken]);

  return <div>Dashboard</div>;
};

export default Dashboard;
