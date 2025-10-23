import React from 'react'
import { useStateContext } from '../state/StateContext'
import AppWindow from './Window'

const Opened = () => {
    const { opened } = useStateContext()

    return (
        <>
            {
                opened.map(app => (
                    <AppWindow key={app.id} app={app} />
                ))
            }
        </>
    )
}

export default Opened