import React, { useEffect, useState, useRef, Component } from "react";
import { motion } from "framer-motion";
import { bounce } from "react-animations";
import styled, { keyframes } from "styled-components";
import Head from "next/head";
import Image, { ProgressBar } from "react-bootstrap";
import MicRecorder from "mic-recorder-to-mp3";
import { BsRecordCircle, BsFillStopFill } from "react-icons/bs";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import ReactAnimations from "./bounce.js";
import faded from "./fade.js";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function Home() {
    const Ref = useRef(null);
    const [timer, setTimer] = useState("20");
    const [state, setState] = useState({
        isRecording: false,
        blobURL: null,
        boomedBlobURL: null,
        isBlocked: false,
        waitingServer: false,
        ternaryState: "idle", // 'idle', 'waiting', 'success'
        error: "",
        audioInfo: null // the data we get back from the server
    });

    //Record button function
    const start = () => {
        console.log("Start: state:", { state });
        if (state.isBlocked) {
            console.log("Permission Denied");

        //Succcessful activation
        } else {
            Mp3Recorder.start()
                //Start timer
                .then(() => {
                    onClickReset();
                    setState({ ...state, isRecording: true });
                    console.log("Start success: state:", { state });
                })
                .catch((e) => console.error(e));
        }
    };

    //Stop recording button function
    const stop = async () => {
        try {
            let newState = state;

            console.log("Stop: state:", { state });

            const [buffer, blob] = await Mp3Recorder.stop().getMp3();
            console.log(
                `Uploading file to server: ${process.env.NEXT_PUBLIC_SERVER_URL}`
            );
                
            //Stop timer countdown
            clearTimer(getDeadTime() - 20);
            const blobURL = URL.createObjectURL(blob);
            setState({
                ...state,
                blobURL: blobURL,
                isRecording: false,
                waitingServer: true,
                ternaryState: "waiting",
            });
            newState.blobURL = blobURL;

            const file = new File([blob], "blobFile.mp3", {
                type: "audio/mp3",
            });
            const formData = new FormData();
            formData.append("file", file, file.name);
            console.log("formData:", formData);
            const data = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("data:", data);
            if (!(data.data.error === 'No speech detected')) {
                console.log(`Speech detected, querying cdn/${data.data.file_name}`)
                const boomedAudio = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/cdn/${data.data.file_name}`, {
                    responseType: 'blob'
                });
                const boomedUrl = URL.createObjectURL(new Blob([boomedAudio.data]));
                newState.boomedBlobURL = boomedUrl;
            } else {
                console.log('No Speech detected.')
            }

            newState.ternaryState = "idle",
            newState.waitingServer = false,
            newState.isRecording = false,

            console.log("Uploaded file to server:", data);
            console.log('State after successfully receiving data', newState);
            setState(newState);
        } catch (e) {
            setState({
                ...state,
                error: 'Error uploading file to server',
                ternaryState: "idle",
                waitingServer: false,
                isRecording: false,
            });
            console.log('State after unsuccessfully receiving data', state);
            console.log(e);
        }
    };

    //Ask for microphone permission
    useEffect(() => {
        navigator.getUserMedia(
            { audio: true },
            () => {
                console.log("Permission Granted");
                setState({ ...state, isBlocked: false });
            },
            () => {
                console.log("Permission Denied");
                setState({ ...state, isBlocked: true });
            }
        );
    }, []);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        return {
            total,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(seconds > 9 ? seconds : "0" + seconds);

            if (total == 0) {
                stop();
            }
        }
    };

    const clearTimer = (e) => {
        setTimer("20");
        if (Ref.current) {
            clearInterval(Ref.current);
        }
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 20);
        return deadline;
    };

    const onClickReset = () => {
        clearTimer(getDeadTime());
    };

    return (
        <>
            <Head>
                <title>2022 Imposter Detector</title>
                <meta name="description" content="Funni imposter detector" />
                <link rel="icon" href="images/amogus.png" />
            </Head>

            {/* <div id="left-container" style={{ paddingTop: "2rem", paddingBottom: 0, marginBottom: 0, border: 0, backgroundColor: "#9B0000", }} >
                <ReactAnimations source="/images/black.png" width={150} height={150} ></ReactAnimations>
            </div> */}

            {/* Main div */}
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#9B0000",
                    padding: "2rem",
                }}
            >
                <div id="left-container">
                    <ReactAnimations
                        source="/images/black.png"
                        width={150}
                        height={150}
                    />
                </div>
                <div
                    style={{
                        paddingLeft: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Main card */}
                    <Card
                        style={{
                            display: "flex",
                            width: "30rem",
                            alignItems: "center",
                            backgroundColor: "#D3D3D3",
                            borderWidth: 4,
                            borderColor: "black",
                            borderRadius: "10px",
                        }}
                    >
                        <Card.Header
                            className="bg-dark text-white"
                            style={{
                                width: "100%",
                                borderRadius: 5,
                                fontSize: 30,
                            }}
                        >
                            SOMETHING SOUNDS SUS...
                        </Card.Header>
                        <Card.Body style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                            <Card.Title>
                                Record Audio (20 second limit)
                            </Card.Title>
                            <Card.Text style={{ height: "30" }}>
                                Use the red button to call an emergency meeting
                                (stop recording)
                                <br />
                            </Card.Text>
                            <ProgressBar
                                animated
                                now={5 * parseInt(timer)}
                                style={{ height: "8px" }}
                            />
                            <br />
                            <ViewButton state={state} startFun={start} stopFun={stop} />
                            <hr></hr>
                            { state.blobURL && <>
                                <Card.Title>Playback Audio</Card.Title>
                                <Card.Text style={{ height: "30" }}>
                                    Listen and download your original audio
                                </Card.Text>
                                <audio src={state.blobURL} controls="controls" />
                                <hr></hr>
                            </>}
                            { state.boomedBlobURL && <>
                                <Card.Title>Sussification</Card.Title>
                                <Card.Text style={{ height: "30" }}>
                                    Looks like we detected {}
                                </Card.Text>
                                <audio src={state.boomedBlobURL} controls="controls" />
                                <hr></hr>
                            </>}
                            <Card.Img
                                src={"images/amogus.png"}
                                style={{
                                    borderRadius: "15px",
                                    borderWidth: "5px",
                                    borderColor: "black",
                                }}
                                alt="amogus"
                            />
                        </Card.Body>
                    </Card>
                    <br></br>
                    {/* Results card */}
                    <Card
                        style={{
                            display: "flex",
                            width: "30rem",
                            alignItems: "center",
                            backgroundColor: "#D3D3D3",
                            borderWidth: 4,
                            borderColor: "black",
                            borderRadius: "10px",
                        }}
                    >
                        <Card.Header
                            className="bg-dark text-white"
                            style={{
                                width: "100%",
                                borderRadius: 5,
                                fontSize: 30,
                            }}
                        >
                            RESULTS
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>
                                Download your sussified audio recording!
                            </Card.Title>
                            {/* INSERT MP3 LINK */}
                            <hr></hr>
                            <Card.Title>Recording Statistics</Card.Title>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* </div> */}

            {/* </div> */}
        </>
    );
}

// state:idle, waiting, success, error
const ViewButton = ({ state, startFun, stopFun }) => {
    console.log('ViewButton state:', state);
    let variant = state.ternaryState === "idle" ? "primary" : "success";
    variant = state.ternaryState === "waiting" ? "caution" : variant;
    variant = state.isRecording ? "danger" : variant;

    let onClickCmd = state.isRecording ? stopFun : startFun;
    onClickCmd = state.ternaryState === 'waiting' ? () => {} : onClickCmd; // if waiting, default to noop

    let content;
    if (state.ternaryState === "waiting") {
        content = "Waiting...";
    } else if (state.isRecording) {
        content = <><BsFillStopFill /> Stop</>;
    } else if (state.ternaryState === "idle") {
        content = <><BsRecordCircle /> Record</>
    } else {
        content = <>Wuh oh</>
    }
    
    return(
        <Button
            id="start-button"
            variant={variant}
            size="lg"
            onClick={onClickCmd}
            style={{
                width: "170px",
                margin: "auto",
                transition: "width 2s",
            }}
            disabled={state.ternaryState === 'waiting'}
        >
            {content}
        </Button>
    );
};
