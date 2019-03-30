import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import { capitalize } from "./utils";

function Difficulty({ difficulty, setDifficulty }) {
  const difficulties = ["easy", "medium", "hard"];

  return (
    <TextField
      select
      label="Difficulty"
      value={difficulty}
      onChange={({ target: { value } }) => setDifficulty(value)}
      helperText="Select game difficulty"
      margin="normal"
      variant="outlined"
    >
      {difficulties.map(difficulty => (
        <MenuItem key={difficulty} value={difficulty}>
          {capitalize(difficulty)}
        </MenuItem>
      ))}
    </TextField>
  );
}

function App() {
  const [difficulty, setDifficulty] = useState("easy");

  return (
    <div>
      <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
    </div>
  );
}

export default App;
