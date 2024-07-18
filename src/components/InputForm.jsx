import { EnvelopeIcon } from '@heroicons/react/16/solid'
import React from 'react'

export default function InputForm({inputType, labelForm, inputPlaceholder, inputName, setChangevalue}) {
  return (
    <div className='inputItem'>
        <span>{labelForm}</span>
        <div className='inputForm'>
            <EnvelopeIcon className='inputIcon' />
            <input type={inputType} placeholder={inputPlaceholder} name={inputName} onChange={setChangevalue}/>
        </div>
    </div>
  )
}
