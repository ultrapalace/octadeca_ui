import {initStore} from '../helpers/init'
import { store } from '../modules/store'

export const bootFromEMMC = async num => {
    console.log("booting from EMMC slot " + num)
    let res = await fetch(
        "/bootFromEmmc",
        {
            method: "GET",
            headers: {
                "index":num
            }
        }
    )
    .catch(e=>console.log(e))
}

export const restoreEMMC = async (file) => {
    store.loadProgress = 0
    store.loadingTitle = `Restoring eMMC from image ${file.name}`
    store.setLoading(true)
    let res = await fetch(
        "/restoreEMMC",
        file,
        {
            method: "GET",
        }
    )
    .catch(e=>console.log(e))
    store.setLoading(false)
}
