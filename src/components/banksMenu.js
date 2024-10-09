import React, { useState, useRef, useEffect } from 'react';
import {Text} from '../components/text'
import {store} from '../modules/store.js'
import {observer} from 'mobx-react-lite'
import {Button} from '../components/button'
import { NUM_BANKS } from '../modules/constants.js';

const getNextBank = () => {
    for(var i=0; i<NUM_BANKS; i++){
        const name = store.banks[i].name
        if(name.length == 0){
            return i
        }
    }
    return -1
}

export const BanksMenu = observer(() =>
    <div>
        <div style={container}>
            {
                [...Array(NUM_BANKS + 1).fill()].map((_,i)=>
                    <BankButton key={i} i={i}/>
                )
            }
        </div>
    </div>
)
const BankButton = observer(({i}) => {
    const downloadJSONRef = useRef()
    const uploadJSONRef = useRef()
    if(i == NUM_BANKS){
        return(
            <div 
                style={bankButton(-1)}
                title="new bank"
                onClick={()=>{
                    const nextBank = getNextBank()
                    if(nextBank == -1){
                        window.alert("no banks left")
                        return
                    }
                    const name = window.prompt("enter new bank name")
                    if(!name) return
                    store.configNeedsUpdate = true
                    store.setBankName(nextBank, name)
                    store.currentBank = nextBank
                }}
            >
                <Text primary medium>
                    new bank
                </Text>
            </div>
        )
    }
    if(store.banks[i].name.length == 0){
        return null
    }
    return(
        <div 
            style={bankButton(i)}
            onClick={({shiftKey,altKey,metaKey})=>{
                if(shiftKey && altKey){
                    if(!window.confirm("load voice config from disk?")) return
                    uploadJSONRef.current.click()
                }else if(shiftKey){
                    if(!window.confirm("save voice config to disk?")) return
                    const data = store.getVoiceData(i)
                    const json = JSON.stringify(data, null, 2)
                    const blob = new Blob([json], {type:'application/json'})
                    const href = URL.createObjectURL(blob)
                    downloadJSONRef.current.href = href
                    downloadJSONRef.current.download = "wvr.json"
                    downloadJSONRef.current.click()
                } else {
                    store.currentBank = i
                    store.currentVoice = store.getCurrentBank().voice
                }
            }}
        >
            <a  
                download
                ref={downloadJSONRef}
            />
            <input 
                ref={uploadJSONRef}
                type="file" 
                onChange={e=>{
                    if(e.target.files.length < 1) return
                    const file = e.target.files[0]
                    const fileReader = new FileReader();
                    fileReader.readAsText(file, "UTF-8");
                    fileReader.onload = e => {
                        console.log("reading file")
                        const data = JSON.parse(e.target.result)
                        store.setVoiceData(i, data)
                    };
                }}
                style={{display:'none'}}
                accept=".json"
            />
            <Text primary medium>
                {`${i+1} ${store.banks[i].name}`}
            </Text>
        </div>
    )
})
const bankButton = i => ({
    display:'flex',
    height:100,
    width:200,
    border:`1px solid ${i==store.currentBank?'gold':store.theme.primary}`,
    margin:5,
    borderRadius:2,
    alignItems:'center',
    justifyContent:'center',
    // marginLeft:  i== 0  ? 76 : 2,
    // marginRight: i== 15 ? 76 : 2,
    boxShadow:`0px 0px ${i==store.currentBank?10:2}px gold`,
    cursor:'pointer',
    userSelect:'none',
})

const container = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    flexWrap: "wrap",
    maxHeight: "50vh",
    overflow: "scroll"
}

const title = {
    width:"100%", 
    color:"gold",  
    flexDirection:"row", 
    display:"flex",
    alignItems:"center",
    marginTop:10,
    marginBottom:10,
    fontSize:22
}