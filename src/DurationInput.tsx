import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function DurationInput(props:any) {
  const classes = useStyles();
  const handleOnClick = (event:any)=>{
    console.log("Handling Input OnClick")
    props?.parentCallback({minutes:event.target.minutes.value, seconds: event.target.seconds.value})
  }
  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleOnClick}>
      <TextField id="minutes" label="Minute" variant="outlined" name="minutes" type="number" defaultValue="10"/>
      <TextField id="seconds" label="Second" variant="outlined" name="seconds" type="number" defaultValue="00"/>
      <Button type="submit" >OK</Button>
    </form>
  );
}
