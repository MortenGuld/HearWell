import React, { useState, useEffect, useRef } from 'react';
import { playTone, initAudio } from '../utils/audio';

const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];
const MAX_VOLUME = 1.0;
const VOLUME_STEP = 0.05;
const INITIAL_VOLUME = 0.0;

export default function HearingTest() {
    const [step, setStep] = useState('welcome'); // welcome, calibration, test, results
    const [results, setResults] = useState({ left: {}, right: {} });

    const [currentEar, setCurrentEar] = useState('left');
    const [freqIndex, setFreqIndex] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(INITIAL_VOLUME);
    const [isTestRunning, setIsTestRunning] = useState(false);

    const timerRef = useRef(null);

    const startTest = () => {
        initAudio();
        setStep('calibration');
    };

    const startCalibration = () => {
        playTone(1000, 0.1, 0, 1);
    };

    const confirmCalibration = () => {
        setStep('test');
        startFrequencyTest('left', 0);
    };

    const startFrequencyTest = (ear, fIndex) => {
        setCurrentEar(ear);
        setFreqIndex(fIndex);
        setCurrentVolume(INITIAL_VOLUME);
        setIsTestRunning(true);
    };

    useEffect(() => {
        if (step === 'test' && isTestRunning) {
            const interval = setInterval(() => {
                if (currentVolume >= MAX_VOLUME) {
                    // Safety stop or auto-skip if too loud (shouldn't happen ideally)
                    handleResponse(MAX_VOLUME);
                    return;
                }

                // Play tone
                const pan = currentEar === 'left' ? -1 : 1;
                playTone(FREQUENCIES[freqIndex], currentVolume, pan, 0.5);

                // Increase volume for next pulse
                setCurrentVolume(v => Math.min(v + VOLUME_STEP, MAX_VOLUME));

            }, 1500); // Pulse every 1.5s

            timerRef.current = interval;
            return () => clearInterval(interval);
        }
    }, [step, isTestRunning, currentVolume, freqIndex, currentEar]);

    const handleResponse = () => {
        clearInterval(timerRef.current);
        setIsTestRunning(false);

        // Record result
        setResults(prev => ({
            ...prev,
            [currentEar]: {
                ...prev[currentEar],
                [FREQUENCIES[freqIndex]]: currentVolume
            }
        }));

        // Move to next
        if (freqIndex < FREQUENCIES.length - 1) {
            // Next frequency
            setTimeout(() => startFrequencyTest(currentEar, freqIndex + 1), 1000);
        } else if (currentEar === 'left') {
            // Switch to right ear
            setTimeout(() => startFrequencyTest('right', 0), 1000);
        } else {
            // Finish
            setStep('results');
        }
    };

    const reset = () => {
        setStep('welcome');
        setResults({ left: {}, right: {} });
        setCurrentEar('left');
        setFreqIndex(0);
        setCurrentVolume(INITIAL_VOLUME);
    };

    return (
        <div className="hearing-test-container">
            {step === 'welcome' && (
                <div className="card fade-in">
                    <h1>HearWell</h1>
                    <p>Assess your hearing health with our professional-grade frequency test.</p>
                    <p className="note">Please use headphones for accurate results.</p>
                    <button onClick={startTest}>Start Assessment</button>
                </div>
            )}

            {step === 'calibration' && (
                <div className="card fade-in">
                    <h2>Calibration</h2>
                    <p>Set your device volume to 50%.</p>
                    <p>Press the button below to play a sample tone.</p>
                    <button onClick={startCalibration} style={{ marginRight: '1rem' }}>Play Sample Tone</button>
                    <button onClick={confirmCalibration} className="primary">I'm Ready</button>
                </div>
            )}

            {step === 'test' && (
                <div className="card fade-in">
                    <h2>Testing {currentEar === 'left' ? 'Left' : 'Right'} Ear</h2>
                    <div className="frequency-display">
                        <span>{FREQUENCIES[freqIndex]} Hz</span>
                    </div>
                    <p>Press the button as soon as you hear the sound.</p>
                    <div className="visualizer">
                        {/* Simple visual feedback that sound is playing (optional, maybe keep hidden to avoid bias) */}
                        <div className={`pulse-indicator ${isTestRunning ? 'active' : ''}`}></div>
                    </div>
                    <button
                        className="large-button"
                        onClick={handleResponse}
                    >
                        I Hear It
                    </button>
                </div>
            )}

            {step === 'results' && (
                <div className="card fade-in">
                    <h2>Your Results</h2>
                    <div className="results-grid">
                        <div className="ear-column">
                            <h3>Left Ear</h3>
                            <ul>
                                {FREQUENCIES.map(f => (
                                    <li key={f}>
                                        <span>{f} Hz</span>
                                        <div className="bar-container">
                                            <div
                                                className="bar"
                                                style={{ width: `${(1 - (results.left[f] || 0)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="ear-column">
                            <h3>Right Ear</h3>
                            <ul>
                                {FREQUENCIES.map(f => (
                                    <li key={f}>
                                        <span>{f} Hz</span>
                                        <div className="bar-container">
                                            <div
                                                className="bar"
                                                style={{ width: `${(1 - (results.right[f] || 0)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p className="disclaimer">
                        Note: This is a screening tool, not a medical diagnosis.
                        Lower bars indicate higher volume threshold (potential hearing loss).
                    </p>
                    <button onClick={reset}>Retake Test</button>
                </div>
            )}
        </div>
    );
}
