import React from "react";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

const ShoutsCard = ({
  classes,
  shouts: { body, commentCount, likeCount, image, shoutedAt, userSubmit }
}) => {
  dayjs.extend(relativeTime);

  return (
    <Card className={classes.card}>
      <CardMedia
        image={image}
        title="Shouter Image"
        className={classes.image}
      />
      <CardContent className={classes.content}>
        <Typography
          variant={"h5"}
          component={Link}
          to={`/users/${userSubmit}`}
          color="secondary"
        >
          {userSubmit}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          posted {dayjs(shoutedAt).fromNow()}
        </Typography>
        <Typography variant="body1">
          {body}{" "}
          {likeCount > 0 ? (
            <FavoriteIcon color="primary" fontSize="small" />
          ) : (
            <FavoriteBorderIcon color="primary" fontSize="small" />
          )}
          {commentCount > 0 ? (
            <ChatBubbleIcon color="primary" fontSize="small" />
          ) : null}
        </Typography>
      </CardContent>
    </Card>
  );
};

const styles = {
  card: {
    display: "flex",
    marginBottom: 10
  },
  title: {
    fontSize: 14
  },
  content: {
    padding: 20,
    objectFit: "cover"
  },
  image: {
    minWidth: 200
  }
};

ShoutsCard.prototype = {
  classes: Proptypes.object.isRequired,
  shouts: Proptypes.object.isRequired
};

export default withStyles(styles)(ShoutsCard);

// Favorite /// FavoriteBorder
