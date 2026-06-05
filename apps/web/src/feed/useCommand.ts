import { useCallback } from 'react'
import { sendCommand } from '.'

const useCommand = (sourceId: string, name: string): (args: string) => void => {
    return useCallback((args: string) => {
        sendCommand(sourceId, name, args)
    }, [sourceId, name])
}

export default useCommand
