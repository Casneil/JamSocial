import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const styles = {
  content: {
    textAlign: "center"
  },
  image: {
    maxWidth: 100,
    margin: "15px auto 15px auto"
  },
  title: {
    margin: "8px auto 8px auto"
  },
  fields: {
    margin: "10px auto 10px auto"
  },
  button: {
    margin: "15px auto 15px auto",
    position: "relative"
  },
  link: {
    color: "#689f38",
    margin: "5px 5px 5px 5px"
  },
  loading: {
    position: "absolute"
  }
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#76ff03",
      main: "#64dd17",
      dark: "#33691e",
      contrastText: "#fff"
    },
    secondary: {
      light: "#8bc34a",
      main: "#689f38",
      dark: "#33691e",
      contrastText: "#fff"
    }
  }
});
