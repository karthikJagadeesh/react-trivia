import React, { useState, useEffect } from "react";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import Game from "./Game";

import {
  MuiThemeProvider,
  withStyles,
  createMuiTheme
} from "@material-ui/core/styles";

import { capitalize } from "./utils";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: '"Poppins", sans-serif'
  },
  palette: {
    primary: {
      main: "#56c8d8",
      dark: "#56c8d8"
    }
  }
});

function Difficulty({ difficulty, setDifficulty }) {
  const difficulties = ["easy", "medium", "hard"];

  const textFieldProps = {
    select: true,
    label: "Difficulty",
    value: difficulty,
    onChange: ({ target: { value } }) => setDifficulty(value),
    helperText: "Select game difficulty & restart",
    margin: "normal",
    variant: "outlined"
  };

  return (
    <TextField {...textFieldProps}>
      {difficulties.map(difficulty => (
        <MenuItem key={difficulty} value={difficulty}>
          {capitalize(difficulty)}
        </MenuItem>
      ))}
    </TextField>
  );
}

const appStyles = {
  wrapper: {
    textAlign: "center"
  }
};

function _App({ classes }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [quiz, setQuiz] = useState(null);
  const [game, restartGame] = useState(false);

  useEffect(() => {
    (async () => {
      setQuiz(null);
      const response = await fetch(
        `https://opentdb.com/api.php?amount=30&category=9&difficulty=${difficulty}&type=multiple`
      );
      const json = await response.json();
      const quiz = json.results.map(result => {
        const choices = [...result.incorrect_answers];
        choices.splice(Math.round(Math.random() * 3), 0, result.correct_answer);
        return {
          ...result,
          choices
        };
      });
      setQuiz(quiz);
    })();
  }, [difficulty, game]);

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.wrapper}>
        <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
        <Game quiz={quiz} onSubmit={() => restartGame(!game)} />
      </div>
    </MuiThemeProvider>
  );
}

export default withStyles(appStyles)(_App);
