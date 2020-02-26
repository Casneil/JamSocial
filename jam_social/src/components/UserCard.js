import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Proptypes from "prop-types";

import dayjs from "dayjs";

import { uploadImage, logout } from "../redux/actions/userActions";

import { withStyles, Button, Paper, Typography } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import MatertialLink from "@material-ui/core/Link";
import TodayIcon from "@material-ui/icons/Today";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import LocationOn from "@material-ui/icons/LocationOn";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";

const UserCard = ({ classes }) => {
  const dispatch = useDispatch();

  const {
    email,
    name,
    imageUrl,
    bio,
    location,
    website,
    joinedOn
  } = useSelector(state => state.user.credentials);

  const loading = useSelector(state => state.ui.loading);
  const authed = useSelector(state => state.user.authed);

  const handleImageUpload = event => {
    const image = event.target.files[0];
    // upload to firebase
    const data = new FormData();
    data.append("image", image, image.name);
    dispatch(uploadImage(data));

    console.log("DDDAAAAATA: ", data);
  };

  const handleEditImage = () => {
    const fileInput = document.getElementById("image-upload");
    fileInput.click();
  };

  let User_Card = !loading ? (
    authed ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="shouterPic" className="profile-image" />
            <input
              type="file"
              id="image-upload"
              hidden="hidden"
              onChange={handleImageUpload}
            />
            <IconButton onClick={handleEditImage} className="button">
              <Tooltip title="upload image" placement="bottom-end">
                <EditIcon color="primary" />
              </Tooltip>
            </IconButton>
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
            <span>Joined {dayjs(joinedOn).format("MMM YYYY")}</span>
          </div>
          <Tooltip title="logout" placement="bottom-end">
            <IconButton onClick={() => dispatch(logout())}>
              <KeyboardReturn color="primary" />
            </IconButton>
          </Tooltip>
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
