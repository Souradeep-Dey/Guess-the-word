import React, { useState } from 'react'

//props maxTime
export default function TimeBar(props) {
  const [timeLeft, setTimeLeft] = useState((props.maxTime))
  let TimeReducer = SetInterval(() => {
    if (timeLeft === 1)
      clearInterval(TimeReducer)
    setTimeLeft(timeLeft - 1)
  }, 1000)

  return (
    <div className="progress" role="progressbar" aria-label="Info striped example" aria-valuenow={`${timeLeft}`} aria-valuemin="0" aria-valuemax={`${props.maxTime}`}>
      <div className="progress-bar progress-bar-striped bg-info" style="width: 50%"></div>
    </div>
  )
}