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
import DurationInput from '../DurationInput'
import SettingsIconDisabled from '@material-ui/icons/SettingsOutlined';
import { Route } from 'react-router-dom'
import ShareField from '../ShareField'

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
    const [showShareField,setShowShareField] = useState(false)
    const [duration,setDuration] = useState(savedDuration)
    const [initRemainingTime,setInitRemainingTime] = useState(savedDuration)
    // let initRemainingTime = Math.floor((expiresAt - Date.now()) / 1000)
    const [timeSpendOnConfiguration, setTimeSpentOnConfiguration] = useState(0)
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
      setInitRemainingTime((expiresAt-Date.now())/1000)
    }
    const timerCompleted = ():any =>{
      console.log("Timer Completed")
      setStatus("COMPLETED")
      // return [true,1500]
    }
    const resetTimer = ():void => {
      console.log("Resetting the timer")
      setStatus("INIT")
      setDuration(savedDuration)
      setInitRemainingTime(savedDuration)
      if(sharedTimer) setSharedTimer(false)
      setKey(prevKey=>prevKey+1)
    }

    const handleShareOnClick = ()=>{
      if(!sharedTimer){
        const timerId = crs({length: 6, type: 'url-safe'})
        setTimerId(timerId)
        setSharedTimer(true)
        setShowShareField(true)  
        fs.collection("timers").doc(timerId).set({
          created_at:createdAt,
          expires_at:expiresAt,
        })
      }
    }
    const renderInMmSs = (remainingTime: number|undefined):any => {
      console.log({remainingTime})
      if(remainingTime){
        // setInitRemainingTime(remainingTime)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return <h3>{zeroPad(minutes)}:{zeroPad(seconds)}</h3>
      }
      return <h3 style={{color:'#218380'}}>అయ్ పోయిందోచ్!</h3>
    }
    console.log({sharedTimer,createdAt,expiresAt,timerId,duration, initRemainingTime, key})
    
    const handleConfigureClick = ()=>{
      console.log("handleConfigureClick")
      // pauseTimer()
      setShowDurationInput(!showDurationInput)
    }
    const handleDurationInput = (data:any)=>{
      console.log({data})
      if(status == "RUNNING") startTimer()
      const inputDuration =parseInt(data?.minutes)*60 +parseInt(data?.seconds) 
      setSavedDuration(inputDuration)
      setShowDurationInput(false)
      if(status == "INIT"){
        setDuration(inputDuration)
        setInitRemainingTime(inputDuration)
        setKey(prevKey=>prevKey+1)
      }
    }
    // if(sharedTimer) startTimer()
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
              const remTime = Math.floor((data?.expires_at - Date.now())/1000)
              console.log({remTime})
              setInitRemainingTime(remTime > 0 ? remTime : 0)
              // setInitRemainingTime(tempDuration/2)
              setKey(prevKey=>prevKey+1)
              setStatus("RUNNING")
            }
        }
        
        if(props?.match?.params?.timerId){
            fetchData(props.match.params.timerId)
        }else {
            // setTimerId(crs({length: 6, type: 'url-safe'}))
        }
    },[props?.match?.params?.timerId])

  return (
      <Box >
        <Box>
           <Box display="flex" justifyContent="center">
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
           </Box>
          <Box m={2} pt={3}>
              <ResetIcon fontSize="large" onClick={resetTimer}/>
              {toggleIcon()}
              <ShareIcon fontSize="large" onClick={handleShareOnClick}/>
              {<ConfigureIcon fontSize="large" onClick={handleConfigureClick}/>}
              {/* {sharedTimer && <SettingsIconDisabled fontSize="large"/>} */}
          </Box>
        </Box>
        
        {showDurationInput &&  <Box marginLeft="10" marginRight="10" marginTop="50">
          <DurationInput parentCallback={handleDurationInput} savedDuration={savedDuration}/>
        </Box>
        }
        {showShareField && <ShareField timerId={timerId}/>}
      </Box>
  );
}

export default Timer
