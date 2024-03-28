import React, { useRef, useEffect, useState } from 'react';
import {store} from '../modules/store.js'
import {observer} from 'mobx-react-lite'
import {clamp} from '../helpers/clamp'
import {Button} from './button'
import {auditionLocal, auditionDisk} from '../audio/audition'


import {NOTE_OFF,ONE_SHOT,LOOP,PAUSE,ASR_LOOP,RETRIGGER,RESTART,NONE,HALT,IGNORE,RELEASE,
    PRIORITIES,LINEAR,FIXED,SQUARE_ROOT,INV_SQUARE_ROOT,PAUSE_LOOP,PAUSE_ASR} from '../modules/constants'
import {SelectNum} from '../components/select'

import { Checkbox } from './checkbox.js';

export const BankDetails = observer(() => {
    const filePicker = useRef(null)
    const directoryPicker = useRef(null)
    const {midiChannel, transpose, pitchbendRangeUp, pitchbendRangeDown, responseCurve, polyphonic} = store.getCurrentBank()
    const allowMultiple = store.wavBoardRange.length > 1 && store.wavBoardInterpolationTarget == undefined
    return(
        <div style={container}>
            <input 
                ref={filePicker}
                multiple = { true }
                type="file" 
                onChange={async e=>{
                    e.persist()
                    if(!e.target.files.length) return
                    const ret = await store.setCurrentWavFile(e.target.files)
                    if(ret == false){ // file dialog dismissed
                        e.target.value = null
                    }
                }}
                style={{display:'none'}}
            />
            <input 
                ref={directoryPicker}
                multiple
                type="file" 
                // onChange={e=>console.log(e.target.files)}
                onChange={async e=>{
                    e.persist()
                    if(!e.target.files.length) return
                    const ret = await store.bulkUploadRacks(e)
                    if(ret == false){ // file dialog dismissed
                        e.target.value = null
                    }
                }}
                style={{display:'none'}}
                directory="" 
                webkitdirectory=""
            />
            <div style={row}>
                <div style={{...column,marginRight:'auto'}}>
                    <SelectNum
                        value={midiChannel}
                        onChange={e=>store.setCurrentBankProp('midiChannel',e)}
                        label="midi channel"
                        style={{width:400}}
                    >
                        {
                            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(x=>
                                <option value={x} key={x}>
                                    {x == 0 ? "omni" : x}
                                </option>    
                            )
                        }
                    </SelectNum>
                    <SelectNum
                        value={transpose}
                        onChange={e=>store.setCurrentBankProp('transpose',e)}
                        label="transpose"
                        style={{width:400}}
                    >
                        {
                            Array(49).fill().map((_, i)=>i-24).map(x=>
                                <option value={x} key={x}>
                                    {x + " semitones"}
                                </option>    
                            )
                        }
                    </SelectNum>
                    <SelectNum
                        value={pitchbendRangeUp}
                        onChange={e=>store.setCurrentBankProp('pitchbendRangeUp',e)}
                        label="pitchbend range up"
                        style={{width:400}}
                    >
                        {
                            [0,1,2,3,4,5,6,7,8,9,10,11,12].map(x=>
                                <option value={x} key={x}>
                                    {x + " semitones"}
                                </option>    
                            )
                        }
                    </SelectNum>
                    <SelectNum
                        value={pitchbendRangeDown}
                        onChange={e=>store.setCurrentBankProp('pitchbendRangeDown',e)}
                        label="pitchbend range down"
                        style={{width:400}}
                    >
                        {
                            [0,1,2,3,4,5,6,7,8,9,10,11,12].map(x=>
                                <option value={x} key={x}>
                                    {x + " semitones"}
                                </option>    
                            )
                        }
                    </SelectNum>
                    <SelectNum
                        value={responseCurve}
                        onChange={e=>store.setCurrentBankProp('responseCurve',e)}
                        label="response curve"
                        style={{width:400}}
                    >
                        <option value={LINEAR}>linear</option>
                        <option value={SQUARE_ROOT}>square root</option>
                        <option value={INV_SQUARE_ROOT}>inv square root</option>
                        <option value={FIXED}>fixed</option>
                    </SelectNum>
                    <SelectNum
                        value={polyphonic}
                        onChange={e=>store.setCurrentBankProp('polyphonic',e)}
                        label="polyphony"
                        style={{width:400}}
                    >
                        <option value={1}>polyphonic</option>
                        <option value={0}>monophonic</option>
                    </SelectNum>
                </div>

                {/*              */}
                {/*    BUTTONS   */}
                {/*              */}

                <div style={{...column,marginLeft:'auto'}}>
                    <Button
                        title={allowMultiple ? "select files": "select file"}
                        // onClick={()=>filePicker.current.click()}
                        onClick={({shiftKey,altKey,metaKey})=>{
                            if(shiftKey && altKey){
                                // TODO interpolate racks

                            } else if(shiftKey){
                                if(store.wavBoardRange.length < 2){
                                    window.alert("Please select range of notes to enable bulk rack upload")
                                    return
                                }
                                directoryPicker.current.click()
                            } else {
                                filePicker.current.click()
                            } 
                        }}
                    />
                    <Button
                        title="bank details"
                        onClick={()=>{
                            store.currentVoice = store.currentBank
                            store.view = "home"
                        }}
                    />
                    <Button
                        warn
                        // style={{border:"1px solid red"}}
                        title="delete"
                        onClick={()=>{
                            if(allowMultiple ? window.confirm(`clear ${store.wavBoardRange.length} selected notes?`) : window.confirm("clear this note?")){
                                if(allowMultiple){
                                    store.clearSelectedNotes()
                                }else{
                                    store.clearCurrentNote()
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
)})

const container = {
    flex:1,
    display:'flex',
    flexDirection:'column',
    marginLeft:70,
    marginRight:70,
    marginTop:30,
    // marginBottom:30,
}

const column = {
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',

}
const row = {
    display:'flex',
    flexDirection:'row'
}