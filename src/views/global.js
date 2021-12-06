import React, { useState, useRef } from 'react';
import {Text} from '../components/text'
import {observer} from 'mobx-react-lite'
import {uploadRecoveryFirmware} from '../wvr/uploadFirmwareAndGUI'
import {Button} from '../components/button'
import {SelectNum} from '../components/select'
import {store} from '../modules/store'
import {fetchLocalIP} from '../wvr/localNetwork'
import {joinLocalNetwork} from '../wvr/localNetwork'

export const Global = observer(() => {
    const [firmware,setFirmware] = useState(null)
    const firmwareFileInput = useRef(null)
    const metadata = store.getMetadata()
    return(
        <div style={container}>
            <Text>
                GLOBAL SETTINGS
            </Text>
            <div style={{display:'flex',flexDirection:'row',margin:20}}>
                <Button
                    warn
                    title="update recovery firmware"
                    style={{cursor:firmware?'pointer':'default',width:300}}
                    onClick={()=>{
                        if(!firmware) return
                        if(!window.confirm("update recovery firmware!?")) return
                        uploadRecoveryFirmware({fileHandle:firmware})
                    }}
                    disabled={!firmware}
                />
                <Button
                    style={{width:300}}
                    title={firmware ? firmware.name : "select recovery firmware"}
                    onClick={()=>{firmwareFileInput.current.click()}}
                />
            </div>
            <SelectNum
                label="global volume"
                value={metadata.globalVolume}
                onChange={e=>store.setMetadataField('globalVolume',e)}
            >
                {Array(128).fill().map((_,i)=><option key ={i} value={i}>{i}</option>)}
            </SelectNum>
            <SelectNum
                label="check recovery pin"
                value={metadata.shouldCheckStrappingPin}
                onChange={e=>window.confirm("this is dangerous are you sure?") && store.setMetadataField('shouldCheckStrappingPin',e)}
            >
                <option value={1}>true</option>
                <option value={0}>false</option>
            </SelectNum>
            <SelectNum
                label="recovery pin"
                value={metadata.recoveryModeStrappingPin}
                onChange={e=>window.confirm("this is dangerous are you sure?") && store.setMetadataField('recoveryModeStrappingPin',e)}
            >
                {Array(14).fill().map((_,i)=><option key ={i} value={i}>{"D"+i}</option>)}
            </SelectNum>
            <SelectNum
                label="wifi log verbosity"
                value={metadata.wLogVerbosity}
                onChange={e=>store.setMetadataField('wLogVerbosity',e)}
            >
                <option value={0}>none</option>
                <option value={1}>error</option>
                <option value={2}>warn</option>
                <option value={3}>info</option>
                <option value={4}>debug</option>
                <option value={5}>verbose</option>
            </SelectNum>
            <SelectNum
                label="wifi on at boot"
                value={metadata.wifiStartsOn}
                onChange={e=>window.confirm("this is dangerous are you sure?") && store.setMetadataField('wifiStartsOn',e)}
            >
                <option value={1}>true</option>
                <option value={0}>false</option>
            </SelectNum>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginLeft:20, width:400}}>
                <Text primary>WVR wifi network name :</Text>
                <Text warn style={{marginLeft:10}}>{store.metadata.wifiNetworkName}</Text>
                <Button
                    style={{marginLeft:'auto'}}
                    title="change"
                    onClick={()=>{
                        const name = window.prompt("enter new WIFI name")
                        if(name){
                            store.metadata.wifiNetworkName = name
                        }
                    }}
                />
            </div>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginLeft:20, width:400}}>
                <Text primary>WVR wifi network password :</Text>
                <Text warn style={{marginLeft:10}}>{store.metadata.wifiNetworkPassword}</Text>
                <Button
                    style={{marginLeft:'auto'}}
                    title="change"
                    onClick={()=>{
                        const name = window.prompt("enter new WIFI password of at least 8 characters")
                        if(name && name.length < 8){
                            alert("password too short")
                            return
                        }
                        if(name){
                            store.metadata.wifiNetworkPassword = name
                        }
                    }}
                />
            </div>
            <SelectNum
                style={{width:350, marginTop:20}}
                label="join external wifi network"
                value={metadata.doStationMode}
                onChange={e=>store.setMetadataField('doStationMode',e)}
            >
                <option value={1}>yes</option>
                <option value={0}>no</option>
            </SelectNum>
            {store.metadata.doStationMode &&
                <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginLeft:20, width:400}}>
                    <Text primary>join network name :</Text>
                    <Text warn style={{marginLeft:10}}>{store.metadata.stationWifiNetworkName}</Text>
                    <Button
                        style={{marginLeft:'auto'}}
                        title="change"
                        onClick={()=>{
                            const name = window.prompt("enter the WIFI network name")
                            if(name){
                                store.metadata.stationWifiNetworkName = name
                            }
                        }}
                    />
                </div>
            }
            {store.metadata.doStationMode &&
                <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginLeft:20, width:400}}>
                    <Text primary>join network password :</Text>
                    <Text warn style={{marginLeft:10}}>{store.metadata.stationWifiNetworkPassword}</Text>
                    <Button
                        style={{marginLeft:'auto'}}
                        title="change"
                        onClick={()=>{
                            const name = window.prompt("enter the WIFI password")
                            if(name){
                                store.metadata.stationWifiNetworkPassword = name
                            }
                        }}
                    />
                </div>
            }
            {store.metadata.doStationMode &&
                <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginLeft:20, width:400}}>
                    <Text primary>
                        {"local IP Address : "}
                    </Text>
                    <Text warn style={{userSelect:"default", marginLeft:10}}>
                        {store.localIP || "unknown"}
                    </Text>
                    <Button
                        style={{marginLeft:'auto'}}
                        title="get IP Address"
                        onClick={()=>fetchLocalIP()}
                    />
                </div>
            }
            {store.metadata.doStationMode &&
                <Button
                    style={{marginLeft:20, width:350}}
                    title="try new network and password"
                    onClick={()=>joinLocalNetwork()}
                />
            }
            <input 
                ref={firmwareFileInput}
                type="file" 
                onChange={e=>setFirmware(e.target.files[0])}
                style={{display:'none'}}
                accept=".bin"
            />

        </div>
    )
})

const container = {
    flex:1,
    display:'flex',
    flexDirection:'column'
}
