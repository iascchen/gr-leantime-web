import React, {useCallback, useEffect, useRef, useState} from 'react'
import useScript from 'react-script-hook'
import {Col, Row} from 'antd'
import NorthPark from './NorthPark'

const VIDEO_SHAPE = [480, 360] // [width, height]

const JeelizPanel = () => {
    const canvasRef = useRef(null)
    const [jeelizLoading, loadingError] = useScript({
        src: '/lib/jeeliz/jeelizFaceTransfer.js',
        checkForExisting: true,
        onload: () => console.log('jeelizFaceTransfer loaded!'),
    })

    const [sJeelizApi, setJeelizApi] = useState()

    useEffect(() => {
        if (!canvasRef.current || jeelizLoading) {
            return
        }
        console.log('init jeelizFaceTransfer', jeelizLoading)
        console.log('loadingError', loadingError)

        // eslint-disable-next-line no-undef
        const api = JEEFACETRANSFERAPI
        if (!api) {
            console.log('miss JEEFACETRANSFERAPI')
            return
        }
        setJeelizApi(api)
    }, [jeelizLoading, canvasRef])

    const nextFrame = useCallback(() => {
        if (!sJeelizApi) {
            return
        }

        if (sJeelizApi.is_detected()) {
            // Do something awesome with rotation values
            let rotation = sJeelizApi.get_rotationStabilized()
            // Do something awesome with animation values
            let expressions = sJeelizApi.get_morphTargetInfluences()

            //**************************************************************************** */

            // The API is detected
            console.log('Detected', rotation, expressions)
        } else {
            // Tell the user that detection is off.
            console.log('Not Detected')
        }
        // Replay frame
        requestAnimationFrame(nextFrame)
    }, [sJeelizApi])
    const successCallback = useCallback(() => {
        nextFrame()
    }, [nextFrame])
    const errorCallback = useCallback((errCode) => {
        // Add code to handle the error
    }, [])

    useEffect(() => {
        if (!sJeelizApi) {
            return
        }

        sJeelizApi.init({
            canvasId: 'jeeliz_canvas',
            NNCpath: '/lib/jeeliz/',
            callbackReady: (errCode) => {
                if (errCode) {
                    console.log(
                        'ERROR - cannot init JEEFACETRANSFERAPI. errCode =',
                        errCode
                    )
                    errorCallback(errCode)
                    return
                }
                console.log('INFO : JEEFACETRANSFERAPI is ready !!!')
                successCallback()
            }
        })
    }, [sJeelizApi])

    return (
        <Row>
            <Col span={20}>
                <div className='webojiSVG' style={{ height: 200 }}>
                    <NorthPark/>
                </div>
            </Col>
            <Col span={4}>
                <canvas ref={canvasRef} id='jeeliz_canvas' width={VIDEO_SHAPE[0]} height={VIDEO_SHAPE[1]}
                    style={{ backgroundColor: 'black' }}/>
            </Col>
        </Row>
    )
}

export default JeelizPanel
