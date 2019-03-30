import React, { useState, memo } from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";

import { withStyles } from "@material-ui/core/styles";

const gameCardStyles = {
  card: {
    marginTop: 20
  },
  cardHeader: {
    color: "#006876",
    textAlign: "start"
  },

  option: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    transition: "font-size .3s ease",
    "&:hover": {
      fontSize: "1.1em",
      cursor: "pointer"
    }
  },

  container: {
    display: "grid",
    gridTemplateColumns: "250px 250px",
    gridRow: "auto auto",
    gridColumnGap: 20,
    gridRowGap: 20,
    justifyContent: "center"
  },

  choice: {
    textAlign: "start"
  }
};

function _GameCard({
  classes,
  optionsChosen,
  setOptionsChosen,
  question,
  index,
  choices
}) {
  const [selectedOption, setSelectedOption] = useState("");

  const onChange = ({ target: { value } }) => {
    setSelectedOption(value);
    setOptionsChosen({ ...optionsChosen, [index]: value });
  };

  return (
    <Card className={classes.card} key={index}>
      <CardHeader
        classes={{ title: classes.cardHeader }}
        title={`${index + 1}) ${question}`}
      />
      <Divider />
      <CardContent>
        <div className={classes.container}>
          {choices.map((choice, index) => {
            const radioProps = {
              color: "primary",
              value: choice,
              onChange,
              checked: selectedOption === choice
            };

            return (
              <div className={classes.option} key={index}>
                <Radio {...radioProps} />
                <span className={classes.choice}>{choice}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const GameCard = memo(withStyles(gameCardStyles)(_GameCard), () => false);

const scoreStyles = theme => ({
  dialog: {
    flex: "0 1 400px"
  },

  cardContent: {
    textAlign: "center",
    fontSize: 30
  },
  cardActions: {
    justifyContent: "flex-end"
  },

  dialogTitle: {
    "& h6": {
      fontSize: 30,
      color: theme.palette.primary.main
    }
  }
});

function _Score({
  classes,
  score,
  difficulty,
  total,
  setOptionsChosen,
  onClose,
  onSubmit
}) {
  const buttonProps = {
    color: "primary",
    variant: "contained",
    onClick: () => {
      setOptionsChosen({});
      onClose();
      onSubmit();
    }
  };
  const dialogProps = {
    open: true,
    onClose,
    classes: {
      paperScrollPaper: classes.dialog
    }
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle className={classes.dialogTitle}>Score</DialogTitle>
      <Divider />
      <CardContent className={classes.cardContent}>
        <div>Difficulty: {difficulty}</div>
        <div>
          {score}/{total}
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.cardActions}>
        <Button {...buttonProps}>Restart game</Button>
      </CardActions>
    </Dialog>
  );
}

const Score = withStyles(scoreStyles)(_Score);

const gameStyles = {
  card: {
    marginTop: 20
  },

  button: {
    margin: "20px 0",
    textAlign: "end"
  }
};

function _Game({ classes, quiz, onSubmit }) {
  const [optionsChosen, setOptionsChosen] = useState({});
  const [gameCompleted, setGame] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <div className={classes.card}>
        <CircularProgress size={100} thickness={1} />
      </div>
    );
  }

  const onClick = () => {
    const score = quiz.filter(
      ({ correct_answer }, index) => optionsChosen[index] === correct_answer
    ).length;
    setGame(true);
    setScore(score);
  };

  const buttonProps = {
    color: "primary",
    variant: "contained",
    disabled: Object.keys(optionsChosen).length < quiz.length,
    onClick
  };
  const scoreProps = {
    score,
    total: quiz.length,
    difficulty: quiz[0].difficulty,
    onClose: () => setGame(false),
    onSubmit,
    setOptionsChosen
  };

  return (
    <>
      {quiz.map(({ choices, question }, index) => {
        const gameCardProps = {
          key: index,
          question,
          index,
          choices,
          setOptionsChosen,
          optionsChosen
        };

        return <GameCard {...gameCardProps} />;
      })}
      <div className={classes.button}>
        <Button {...buttonProps}>Submit</Button>
      </div>
      {gameCompleted && <Score {...scoreProps} />}
    </>
  );
}

const Game = withStyles(gameStyles)(_Game);

export default Game;
