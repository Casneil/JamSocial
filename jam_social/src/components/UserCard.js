import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Proptypes from "prop-types";

import dayjs from "dayjs";

import { withStyles, Button, Paper, Typography } from "@material-ui/core";
import MatertialLink from "@material-ui/core/Link";
import TodayIcon from "@material-ui/icons/Today";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";

const UserCard = ({
  classes,
  user: {
    credentials: {
      shoutedAt,
      name,
      imageUrl,
      createdAt,
      bio,
      location,
      website
    }
  }
}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  console.log(user);

  let User_Card = !loading ? (
    authed ? (
      <Paper classname={classes.paper}>
        <div className={classes.profile}>
          <div className="profile-image">
            <img src={imageUrl} alt="shouterPic" className="profile-image" />
          </div>
          <hr />
          <div className="profile-details">
            <MatertialLink
              component={Link}
              to={`/users${name}`}
              color="primary"
              variant="h5"
            >
              @{name}
            </MatertialLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <>
                <LocationOn color="primary" /> <span>{location}</span>
                <hr />
              </>
            )}
            {website && (
              <>
                <LinkIcon color="primary" />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                />{" "}
                {website}
                <hr />
              </>
            )}
            <TodayIcon color="primary" />{" "}
            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No user found, please try again
        </Typography>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
          >
            Sign Up!
          </Button>
        </div>
      </Paper>
    )
  ) : (
    <p>loading...</p>
  );

  return User_Card;
};

const styles = theme => ({
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%"
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
});

UserCard.Proptypes = {
  styles: Proptypes.object.isRequired,
  dispatch: Proptypes.func.isRequired,
  classes: Proptypes.object.isRequired,
  user: Proptypes.object.isRequired
};

export default withStyles(styles)(UserCard);
