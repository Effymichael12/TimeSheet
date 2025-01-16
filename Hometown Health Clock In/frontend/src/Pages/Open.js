import React from 'react'

function Open() {
  return (
    <div className='main'>
      <h1 className='title'>Time-Sheet Manager</h1>
      <p className='info'>Admin Verification Required to Open Timesheet. </p>
      <button onClick={()=>window.location.href = '/signin'} className='clock-in-button'>Open Timesheet </button>

    </div>
  )
}

export default Open