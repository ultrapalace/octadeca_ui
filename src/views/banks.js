import React from 'react';
import {observer} from 'mobx-react-lite'
import {BanksMenu} from '../components/banksMenu'
import {BankDetails} from '../components/bankDetails'

export const Banks = observer(() => {
    return(
        <div style={container}>
            <BanksMenu/>
            <BankDetails/>
        </div>
    )
})

const container = {
    flex:1,
    display:'flex',
    flexDirection:'column',
    position:'relative',
    justifyContent:'space-around',
    padding:0,
    margin:0
}