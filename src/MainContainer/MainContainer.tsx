import { Box } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { Switch, Route, Redirect, BrowserRouter} from 'react-router-dom'
import Timer from '../Timer/Timer'
import fs from '../firebase'
import crs from 'crypto-random-string'


const MainContainer = (props:any)=>{
    const [timerId,setTimerId] = useState("") 
    const [createdAt,setCreatedAt] = useState(0)
    const [expiresAt, setExpiresAt] = useState(0)
    const [sharedTimer,setSharedTimer] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

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
            }
            setIsFetching(false)
        }
        
        if(props?.match?.params?.timerId){
            fetchData(props.match.params.timerId)
        }else {
            setIsFetching(false)
            setTimerId(crs({length: 6, type: 'url-safe'}))
        }
    },[props?.match?.params?.timerId])

    return (
        <div>
            {!isFetching && 
            <Timer 
                timerId={timerId}
                createdAt={createdAt}
                expiresAt={expiresAt}
                sharedTimer={sharedTimer}
            />
            }
        </div> 
    )
}


export default MainContainer