import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HearingTest from './HearingTest';
import * as audioUtils from '../utils/audio';

vi.mock('../utils/audio', () => ({
    initAudio: vi.fn(),
    playTone: vi.fn(),
}));

describe('HearingTest', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders welcome screen initially', () => {
        render(<HearingTest />);
        expect(screen.getByText('HearWell')).toBeInTheDocument();
        expect(screen.getByText('Start Assessment')).toBeInTheDocument();
    });

    it('transitions to calibration on start', () => {
        render(<HearingTest />);
        fireEvent.click(screen.getByText('Start Assessment'));
        expect(screen.getByText('Calibration')).toBeInTheDocument();
        expect(audioUtils.initAudio).toHaveBeenCalled();
    });

    it('plays sample tone in calibration', () => {
        render(<HearingTest />);
        fireEvent.click(screen.getByText('Start Assessment'));
        fireEvent.click(screen.getByText('Play Sample Tone'));
        expect(audioUtils.playTone).toHaveBeenCalledWith(1000, 0.1, 0, 1);
    });

    it('transitions to test on confirm calibration', () => {
        render(<HearingTest />);
        fireEvent.click(screen.getByText('Start Assessment'));
        fireEvent.click(screen.getByText("I'm Ready"));
        expect(screen.getByText(/Testing Left Ear/i)).toBeInTheDocument();
    });

    it.skip('advances to next frequency after response', async () => {
        vi.useFakeTimers();
        render(<HearingTest />);

        // Start
        fireEvent.click(screen.getByText('Start Assessment'));
        fireEvent.click(screen.getByText("I'm Ready"));

        // Check first freq
        expect(screen.getByText('250 Hz')).toBeInTheDocument();

        // Respond
        fireEvent.click(screen.getByText('I Hear It'));

        // Advance time
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Check next freq
        await waitFor(() => expect(screen.getByText('500 Hz')).toBeInTheDocument());

        vi.useRealTimers();
    });
});
