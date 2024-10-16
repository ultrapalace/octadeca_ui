import React, { useRef, useEffect, useState } from 'react';
import {store} from '../modules/store.js'
import {observer} from 'mobx-react-lite'
import {clamp} from '../helpers/clamp'
import {Button} from './button'
import { Stack } from './stack.js';
import {auditionLocal, auditionDisk} from '../audio/audition'
import { handleSFZ } from '../helpers/sfz.js';
import {Text} from '../components/text'

import { getNextBank, getNextVoice } from './banksMenu.js';

import {NOTE_OFF,ONE_SHOT,LOOP,PAUSE,ASR_LOOP,RETRIGGER,RESTART,NONE,HALT,IGNORE,RELEASE,
    PRIORITIES,LINEAR,FIXED,SQUARE_ROOT,INV_SQUARE_ROOT,PAUSE_LOOP,PAUSE_ASR,
    NUM_BANKS} from '../modules/constants'
import {SelectNum} from '../components/select'

import { Checkbox } from './checkbox.js';

export const BankDetails = observer(() => {

    const filePicker = useRef(null)
    const directoryPicker = useRef(null)

    const sfzFileInput = useRef(null)
    const sfzFolderInput = useRef(null)

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
                            [0,1,2].map(x=>
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
                    <div style={{...row, marginLeft:16}}>
                        <div style={{...column, width:252}}>
                            <Stack
                                items = {["voice"]}
                            />
                        </div>
                        <div style={column}>
                            <Stack
                                items = {[store.getCurrentBank().voice]}
                            />
                        </div>
                    </div>
                </div>

                {/*              */}
                {/*    BUTTONS   */}
                {/*              */}

                <div style={{...column,marginLeft:'auto'}}>
                    <Button
                        style={{width:200}}
                        title="select .sfz file"
                        onClick={()=>sfzFileInput.current.click()}
                        />
                    <Button
                        style={{width:200}}
                        title="select .sfz folder"
                        onClick={()=>sfzFolderInput.current.click()}
                        />
                    <Button
                        style={{width:200}}
                        title="bank details"
                        onClick={()=>{
                            store.currentVoice = store.getCurrentBank().voice
                            store.view = "home"
                        }}
                    />
                    <Button
                        style={{width:200}}
                        title="rename bank"
                        onClick={()=>{
                            const name = window.prompt("enter new bank name")
                            if(!name) return
                            store.configNeedsUpdate = true
                            store.setBankName(store.currentBank, name)
                        }}
                    />
                    <Button
                        style={{width:200}}
                        title="reorder bank"
                        onClick={()=>{
                            const position = parseInt(window.prompt("enter new bank number"))
                            const banks = store.getBanks()
                            let numBanks = 0
                            for(var i=0; i< NUM_BANKS; i++){
                                if(banks[i].name.length > 0){
                                    numBanks++
                                }
                            }
                            if(position == NaN){
                                alert("thats not a number")
                                return
                            } else if(position < 1){
                                alert("minimum position is 1")
                                return
                            } else if(position > numBanks){
                                alert("maximum position is " + numBanks)
                                return
                            }

                            const [movedItem] = banks.splice(store.currentBank, 1);
                            banks.splice(position - 1, 0, movedItem);
                            store.banks.replace(banks)
                            store.configNeedsUpdate = true
                        }}
                    />
                    <Button
                        title="duplicate bank"
                        style={{width:200}}
                        onClick={()=>{
                            const bankToDuplicate = {...store.getBanks()[store.currentBank]}
                            const nextBank = getNextBank()
        
                            if(nextBank == -1){
                                window.alert("no banks left")
                                return
                            }
        
                            const name = window.prompt("enter new bank name")
                            if(!name) return
                            store.configNeedsUpdate = true
                            const banks = store.getBanks()
                            banks[nextBank] = {...bankToDuplicate}
                            store.setBankName(nextBank, name)
                            store.currentBank = nextBank
                            store.banks.replace(banks)
                        }}
                    />
                    <Button
                        warn
                        // style={{border:"1px solid red"}}
                        title="delete"
                        onClick={()=>{
                            if(window.confirm("clear this bank?")){
                                store.selectAllNotes()
                                store.clearSelectedNotes()
                                store.setBankName(store.currentBank, "")
                                store.voiceNeedsUpdate()
                                store.shuffleBanksLeft()
                            }
                        }}
                    />
                </div>
            </div>
            <input 
                ref={sfzFolderInput}
                multiple
                type="file" 
                onChange={async e=>{
                    if(!e.target.files.length) return
                    e.persist()
                    store.setLoading(true)
                    await handleSFZ(e).catch(alert)
                    e.target.value = null
                    store.setLoading(false)
                    store.view="home"
                }}
                style={{display:'none'}}
                directory="" 
                webkitdirectory=""
            />
            <input 
                ref={sfzFileInput}
                multiple
                type="file" 
                onChange={async e=>{
                    if(!e.target.files.length) return
                    e.persist()
                    store.setLoading(true)
                    await handleSFZ(e).catch(alert)
                    e.target.value = null
                    store.setLoading(false)
                    store.view="home"
                }}
                style={{display:'none'}}
            />
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