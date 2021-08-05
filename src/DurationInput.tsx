import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Box, Button } from '@material-ui/core';
import { useState } from 'react';
import { zeroPad } from 'react-countdown';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    "& .MuiFormLabel-root":{
      color: "#d3d3d3",
      "&.Mui-focused": {
        color: "#23A5EB"
      }
    }
  },
}));

export default function DurationInput(props:any) {
  const classes = useStyles();
  const defMin = Math.floor(props?.savedDuration / 60)
  const defSec = props?.savedDuration % 60
  // const [defMin,setDefMin] = useState(props?.savedDuration)
  const handleOnClick = (event:any)=>{
    console.log("Handling Input OnClick")
    props?.parentCallback({minutes:event.target.minutes.value, seconds: event.target.seconds.value})
  }
  return (
    <Box>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleOnClick}>
        <TextField id="minutes" label="Minute" variant="outlined" name="minutes" type="number" defaultValue={zeroPad(defMin)}/>
        <TextField id="seconds" label="Second" variant="outlined" name="seconds" type="number" defaultValue={zeroPad(defSec)}/>
        <Button type="submit" color="primary" variant="contained">OK</Button>
      </form>
    </Box>
  );
}
