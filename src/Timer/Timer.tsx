import { zeroPad } from 'react-countdown'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import PlayIcon from '@material-ui/icons/PlayArrowRounded'
import StopIcon from '@material-ui/icons/PlayArrowTwoTone'
import PauseIcon from '@material-ui/icons/PauseRounded'
import ShareIcon from '@material-ui/icons/ShareRounded'
import ResetIcon from '@material-ui/icons/SettingsBackupRestoreRounded'
import ConfigureIcon from '@material-ui/icons/Settings';
import Box from '@material-ui/core/Box'
import { useEffect, useRef, useState } from 'react'
import crs from 'crypto-random-string'
import fs from '../firebase'
import { create } from 'jss'
import DurationInput from '../DurationInput'
import { Button } from '@material-ui/core'
const Completionist = ():any => <h1>అయ్ పోయిందోచ్!</h1>;

/*
  status:enum, created_at:timestamp, 
  expires_at:timestamp, timer_id:string, 
  progress:number (0-100), sharedTimer:boolean
*/
/*
  status : {INIT, RUNNING, PAUSED, STOPPED, COMPLETED}
*/
function Timer(props:any) {
    const [status,setStatus] = useState("INIT") // 
    const [createdAt, setCreatedAt] = useState(0)
    const [expiresAt, setExpiresAt] = useState(0)
    // const newTimerId = crs({length: 6, type: 'url-safe'}) 
    const [savedDuration, setSavedDuration] = useState(10*60)
    const [timerId,setTimerId] = useState("") 
    const [sharedTimer, setSharedTimer] = useState(false)
    const [key,setKey] = useState(0)
    // let countdownApi:CountdownApi | null = null
    // let duration = Math.floor((expiresAt - createdAt) / 1000) // duration in sec
    const [showDurationInput,setShowDurationInput] = useState(false)
    const [duration,setDuration] = useState(savedDuration)
    const [initRemainingTime,setInitRemainingTime] = useState(savedDuration)
    // let initRemainingTime = Math.floor((expiresAt - Date.now()) / 1000)
    const toggleIcon = () => {
        if(sharedTimer) return <StopIcon fontSize="large"/> 
        switch(status) {
            case "INIT": 
            case "PAUSED" : return <PlayIcon onClick={startTimer} fontSize="large"/>
            case "RUNNING" : return <PauseIcon onClick={pauseTimer} fontSize="large"/>
            case "STOPPED" : 
            case "COMPLETED" : return <StopIcon fontSize="large"/> 
            default : return
        }
    }
    // setTimerId(crs({length: 6, type: 'url-safe'}))
    const startTimer = ():void=>{
      console.log("Timer Started")
      if(status == "INIT"){
        setCreatedAt(Date.now())
        setExpiresAt(Date.now() + duration*1000)
      }
      setStatus("RUNNING")
    }
    const pauseTimer = ():void => {
      console.log("Timer Paused")
      setStatus("PAUSED")
    }
    const timerCompleted = ():any =>{
      console.log("Timer Completed")
      setStatus("COMPLETED")
      // return [true,1500]
    }
    const resetTimer = ():void => {
      console.log("Resetting the timer")
      pauseTimer()

      setKey(prevKey=>prevKey+1)
    }

    const renderInMmSs = (remainingTime: number|undefined):any => {
      if(remainingTime){
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return <h3>{zeroPad(minutes)}:{zeroPad(seconds)}</h3>
      }
      return <h3 style={{color:'#218380'}}>అయ్ పోయిందోచ్!</h3>
    }
    console.log({sharedTimer,createdAt,expiresAt,timerId,duration, initRemainingTime, key})
    
    const handleConfigureClick = ()=>{
      console.log("handleConfigureClick")
      setShowDurationInput(true)
    }
    const handleDurationInput = (data:any)=>{
      console.log({data})
      setSavedDuration(data?.minutes*60 + data?.seconds)
      setShowDurationInput(false)
    }

    useEffect(()=>{
      console.log(props)    
      const fetchData = async (timerId:any)=>{
        const docRef = fs.collection("timers").doc(timerId)
        const doc = await docRef.get()
            if(doc.exists){
              const data = doc.data()
              console.log({data})
              setSharedTimer(true)
              setTimerId(timerId)
              setExpiresAt(data?.expires_at)
              setCreatedAt(data?.created_at)
              const tempDuration = Math.floor((data?.expires_at - data?.created_at)/1000) 
              console.log({tempDuration})
              setDuration(tempDuration)
              setInitRemainingTime(Math.floor((data?.expires_at - Date.now())/1000))
              // setInitRemainingTime(tempDuration/2)
              setKey(prevKey=>prevKey+1)
              setStatus("RUNNING")
            }
        }
        
        if(props?.match?.params?.timerId){
            fetchData(props.match.params.timerId)
        }else {
            setTimerId(crs({length: 6, type: 'url-safe'}))
        }
    },[props?.match?.params?.timerId])

  return (
      <Box>
         <CountdownCircleTimer
            isPlaying={status=="RUNNING" ? true : false}
            duration={duration}
            initialRemainingTime={initRemainingTime}
            key={key}
            colors={[
              ['#EF798A', 0.33],
              ['#F7B801', 0.33],
              ['#A30000', 0.33],
            ]}
            onComplete={timerCompleted}
          >
            {({ remainingTime }) => renderInMmSs(remainingTime)}
          </CountdownCircleTimer>
        <Box >
            <ResetIcon fontSize="large" onClick={resetTimer}/>
            {toggleIcon()}
            <ShareIcon fontSize="large"/>
            <ConfigureIcon fontSize="large" onClick={handleConfigureClick}/>
        </Box>
        {showDurationInput && <DurationInput parentCallback={handleDurationInput}/>}
        {/* {showDurationInput && <Button onClick={}/>} */}
      </Box>
  );
}

export default Timer;
