import React from 'react'

export default function ButtonDark({buttonSpan}) {
  return (
    <button className='buttonDark'>
        <span className='buttonTextLight'>
            {buttonSpan}
        </span>
    </button>
  )
}
