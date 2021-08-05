import { Button, TextField } from "@material-ui/core"
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
//     "& .MuiTouchRipple-root":{
//         backgroundColor: 'red',
//         opacity: .3,
//         // color:"powderblue",
//     },
    '& > *': {
        textTransform: "none",
    },
  },
}));



const ShareField = (props:any)=>{
    const classes = useStyles();
    const pubUrl = "https://shared-timer.vercel.app/timer/"
    const urlToShare = pubUrl + props?.timerId 
    const resizeUrl = (url:string):string=>{
        if(url.length > 50) return url.substring(0,30)
        return url
    }
    const copyTheUrl = ()=>{
        navigator.clipboard.writeText(urlToShare)
    }
    return (
        <Button className={classes.root}startIcon={<FileCopyRoundedIcon/>} onClick={copyTheUrl}variant="contained" color="primary">{resizeUrl(urlToShare)}</Button>
    )
}


export default ShareField