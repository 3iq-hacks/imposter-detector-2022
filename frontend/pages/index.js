import { useEffect, useState } from 'react';
import Head from 'next/head';
//import Image from 'next/image';
import Image from 'react-bootstrap';
import MicRecorder from 'mic-recorder-to-mp3'
import { BsRecordCircle, BsFillStopFill } from 'react-icons/bs'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';


const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function Home() {

    const [state, setState] = useState({
        isRecording: false,
        blobURL: '',
        isBlocked: false
    })

    const stop = () => {
        console.log('Stop: state:', { state })
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                setState({ ...state, blobURL, isRecording: false });
            }).catch((e) => console.log(e));
    };

    const start = () => {
        console.log('Start: state:', { state })
        if (state.isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    setState({ ...state, isRecording: true });
                    console.log('Start success: state:', { state })
                }).catch((e) => console.error(e));
        }
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

    return (
        <>
            <Head>
                <title>2022 Imposter Detector</title>
                <meta name="description" content="Funni imposter detector" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div style={{ display: 'flex', width: '100vw', justifyContent: 'center', alignItems: 'center', backgroundColor: '#B01A17', height:'100vh'}}>
                

                <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Card className="bg-dark text-white" style={{ fontSize: 40 }}>
                        <Card.Title>SOMETHING SOUNDS SUS...</Card.Title>
                    </Card>
                    
                    <Card style={{ width: '30rem', alignItems: 'center', backgroundColor:'#D3D3D3', borderWidth: 4, borderColor: 'black'}}>
                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                        <Card.Body>
                            <Card.Title>Record Audio</Card.Title>
                            <Card.Text style={{ height: '30' }}>
                                Click on the button below to record audio.
                            </Card.Text>
                            <Button variant="primary" size="lg" onClick={start}> <BsRecordCircle /> Record</Button>
                            &nbsp;
                            <Button variant="danger" size="lg" onClick={stop}> < BsFillStopFill /> Stop</Button>
                            <hr></hr>
                            <audio src={state.blobURL} controls="controls"/>
                            <hr></hr>
                            <Card.Img src='https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec' alt='amogus' width="512px" height="512px"/>

                        </Card.Body>
                    </Card>
                    
                    {/* <Image src='https://c.tenor.com/k4gclDi0EbMAAAAd/amogus-amongus.gif' alt='apooogus' width="512px" height="512px"/> */}
                </div>
            </div>
        </>
    )
}
