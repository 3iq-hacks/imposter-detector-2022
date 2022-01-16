import React, { useEffect, useState, useRef, Component } from 'react';
import { motion } from 'framer-motion';
import { bounce } from 'react-animations';
import styled, {keyframes} from 'styled-components';
import Head from 'next/head';
import Image, { ProgressBar } from 'react-bootstrap';
import MicRecorder from 'mic-recorder-to-mp3'
import { BsRecordCircle, BsFillStopFill } from 'react-icons/bs'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ReactAnimations from './bounce.js'

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function Home() {
    const Ref = useRef(null);
    const [timer, setTimer] = useState('20');
    const [state, setState] = useState({
        isRecording: false,
        blobURL: '',
        isBlocked: false
    });
    
    const start = () => {
        console.log('Start: state:', { state })
        if (state.isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    onClickReset();
                    setState({ ...state, isRecording: true });
                    console.log('Start success: state:', { state })
                }).catch((e) => console.error(e));
        }
    };
    
    const stop = () => {
        console.log('Stop: state:', { state })
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                clearTimer(getDeadTime()-20);
                const blobURL = URL.createObjectURL(blob)
                setState({ ...state, blobURL, isRecording: false });
            }).catch((e) => console.log(e));
    };

    useEffect(() => {
        navigator.getUserMedia({ audio: true },
            () => {
                console.log('Permission Granted');
                setState({ ...state, isBlocked: false });
            },
            () => {
                console.log('Permission Denied');
                setState({ ...state, isBlocked: true })
            },
        );
    }, []);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        return {
            total, seconds
        };
    }

    const startTimer = (e) => {
        let { total, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (seconds > 9 ? seconds : '0' + seconds)
            )
            
            if (total == 0) {
                stop();
            }
        }  
    }

    const clearTimer = (e) => {
        setTimer('20');
        if (Ref.current) {
            clearInterval(Ref.current);
        };
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 21);
        return deadline;
    }

    const onClickReset = () => {
        clearTimer(getDeadTime());
    }

    return (
        <>
        {/* <div id = "middle-container"></div> */}
        <div id="left-container" style = {{paddingTop: '2rem', paddingBottom: 0, marginBottom: 0,border:0, backgroundColor: '#9B0000'}}>
            <ReactAnimations source="/images/black.png" width={150} height={150} ></ReactAnimations>
        </div>
        {/* <div id = "right-container"> */}

        <Head>
                <title>2022 Imposter Detector</title>
                <meta name="description" content="Funni imposter detector" />
                <link rel="icon" href="images/amogus.png" />
            </Head>

            <div style={{ display: 'flex', width: '100vw', justifyContent: 'center', alignItems: 'center', backgroundColor: '#9B0000', height:'100vh'}}>

                <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    <Card style={{ display: 'flex', width: '30rem', alignItems: 'center', backgroundColor:'#D3D3D3', borderWidth: 4, borderColor: 'black', borderRadius: '10px'}}>
                        <Card.Header className="bg-dark text-white" style={{width: '100%', borderRadius: 5, fontSize: 30}}>SOMETHING SOUNDS SUS...</Card.Header>
                        <Card.Body>
                            <Card.Title>Record Audio (20 second limit)</Card.Title>
                            <Card.Text style={{ height: '30' }}>
                                Use the red button to call an emergency meeting (stop recording)
                                <br/>
                            </Card.Text>
                            <ProgressBar animated now={(5)*parseInt(timer)} style={{height: '8px'}}/>
                            <br />
                            <Button id="start-button" variant="primary" size="lg" onClick={start} style={{width:'170px', marginRight: '100px', transition: 'width 2s'}} disabled={state.isRecording ? true : false}> <BsRecordCircle /> {state.isRecording ? 'Recording...' : 'Record'}</Button>
                            <Button id = "stop-button" variant="danger" size="lg" onClick={stop} style={{width:'170px'}} disabled={state.isRecording ? false : true}> < BsFillStopFill /> Stop</Button>
                            <hr></hr>
                            <Card.Title>Playback Audio</Card.Title>
                            <Card.Text style={{ height: '30' }}>
                                Listen and download your sussy audio
                            </Card.Text>
                            <audio src={state.blobURL} controls="controls"/>
                            <hr></hr>
                            <Card.Img src={'images/amogus.png'} style={{borderRadius:'15px', borderWidth: '5px', borderColor: 'black'}} alt='amogus' width="512px" height="512px"/>
                        </Card.Body>
                    </Card>
                    
                </div>
            </div>
            
        {/* </div> */}
        
        {/* </div> */}
   
        </>
    )
}
