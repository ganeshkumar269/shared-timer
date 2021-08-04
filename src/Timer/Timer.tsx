// import Countdown, { zeroPad, CountdownApi,CountdownRenderProps } from 'react-countdown'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import PlayIcon from '@material-ui/icons/PlayArrowRounded'
import StopIcon from '@material-ui/icons/PlayArrowTwoTone'
import PauseIcon from '@material-ui/icons/PauseRounded'
import ShareIcon from '@material-ui/icons/ShareRounded'
import ResetIcon from '@material-ui/icons/RotateLeftRounded'
import Box from '@material-ui/core/Box'
import { useRef, useState } from 'react'
import { CountdownProps } from 'react-countdown/dist/LegacyCountdown'

const Completionist = ():any => <h1>అయ్ పోయిందోచ్!</h1>;

// const renderer = ({ hours, minutes, seconds, completed, api }: CountdownRenderProps) => {
//   if (completed) {
//     // Render a completed state
//     return <Completionist />;
//   } else {
//     // Render a countdown
//     if(hours == 0){
//         if(minutes == 0){
//             return <h1>{zeroPad(seconds)}</h1>;
//         }
//         return <h1>{zeroPad(minutes)}:{zeroPad(seconds)}</h1>;
//     }
//     return <h1>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</h1>;
//   }
// };
/*
  status:enum, created_at:timestamp, expires_at:timestamp, timer_id:string, progress:number (0-100), yourTimer:boolean
*/

function Timer(props:any) {
    const [status,setStatus] = useState("PAUSED") // RUNNING, PAUSED, STOPPED
    const [createdAt, setCreatedAt] = useState(props?.created_at)
    const [expiresAt,setExpiresAt] = useState(props?.expires_at)
    const [timerId,setTimerId] = useState(props?.timerId) 
    // let countdownApi:CountdownApi | null = null

    const toggleIcon = () => {
        switch(status) {
            case "PAUSED" : return <PlayIcon onClick={startTimer} fontSize="large"/>
            case "RUNNING" : return <PauseIcon onClick={pauseTimer} fontSize="large"/>
            case "STOPPED" : return <StopIcon fontSize="large"/>
            default : return
        }
    }
    // const setRef = (countdown:Countdown | null):void=>{
    //   if(countdown)
    //     countdownApi = countdown.getApi()
    // }
    const startTimer = ():void=>{
      console.log("Timer Started")
      setStatus("RUNNING")
      // countdownApi?.start()
    }
    const pauseTimer = ():void => {
      console.log("Timer Paused")
      setStatus("PAUSED")
      // countdownApi?.pause()
    }
    const timerCompleted = ():void =>{
      console.log("Timer Completed")
      setStatus("STOPPED")
    }

  return (
      <Box>
        {/* <Countdown 
          date={10*1000}
          key={"fuck"}
          // intervalDelay={1000}
          autoStart={false}
          renderer={renderer} 
          ref={setRef}
          controlled={true}
          onComplete={timerCompleted}
        /> */}
         <CountdownCircleTimer
            isPlaying={status=="RUNNING" ? true : false}
            duration={2*60}
            colors={[
              ['#004777', 0.33],
              ['#F7B801', 0.33],
              ['#A30000', 0.33],
            ]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        <Box >
            <ResetIcon fontSize="large"/>
            {toggleIcon()}
            <ShareIcon fontSize="large"/>
        </Box>
      </Box>
  );
}

export default Timer;
