import React, { useEffect, useState } from "react";

import axios from "axios";

import Grid from "@material-ui/core/Grid";

import ShoutsCard from "../components/ShoutsCard";
import UserCard from "../components/UserCard";

const Home = () => {
  const [data, setData] = useState();

  const fetchData = async () => {
    const request = await axios.get("/shouts");
    const response = await request.data;
    setData(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={10}>
      <Grid item sm={8} xs={10}>
        {data ? (
          data.map(shout => <ShoutsCard shouts={shout} key={shout.shoutId} />)
        ) : (
          <p>Loading....</p>
        )}
      </Grid>
      <Grid item sm={4} xs={10}>
        <p>Profile....</p>
      </Grid>
    </Grid>
  );
};

export default Home;
