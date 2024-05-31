import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './notFound.css'

function NotFound() {
  const navigate = useNavigate()
  const [countdown,setCountDown] = useState(3)

  useEffect(() => {
    setInterval(() => {
      setCountDown((prev) => prev-1)
    },1000)
    setTimeout(() => {
      navigate('/')
    },3000) // eslint-disable-next-line
  },[])

  return (
    <div className='not-found'>
        <h1 className='heading--xlarge'>404</h1>
        <h3 className='heading--medium text--primary'>Page Not Found!</h3>
        <p className='body--medium'>You are directed to the home page {countdown}</p>
    </div>
  )
}

export default NotFound