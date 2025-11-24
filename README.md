# HearWell

HearWell is a modern, web-based hearing assessment application designed to help users perform a preliminary check of their hearing health from the comfort of their home.

## 🎧 Overview

HearWell uses the Web Audio API to generate precise pure tones across standard audiometric frequencies (250Hz to 8000Hz). It guides users through a calibrated test for both left and right ears and provides a visual representation of the results.

**Disclaimer:** This tool is for screening purposes only and does not replace a professional medical diagnosis. If you suspect hearing loss, please consult an audiologist.

## ✨ Features

-   **Full Frequency Range**: Tests hearing at 250, 500, 1000, 2000, 4000, and 8000 Hz.
-   **Separate Ear Testing**: Individually assesses Left and Right ears.
-   **Calibration Mode**: Helps users set an appropriate baseline volume before starting.
-   **Interactive Interface**: Simple "I Hear It" response mechanism.
-   **Visual Results**: Displays a frequency response graph at the end of the test.
-   **Premium UI**: Designed with a modern, dark-mode aesthetic using CSS variables and animations.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd HearWell
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Running Tests

HearWell comes with a suite of automated tests using Vitest and React Testing Library.

To run the tests:

```bash
npm test
```

## 🛠️ Built With

-   [React](https://react.dev/) - UI Library
-   [Vite](https://vitejs.dev/) - Build tool and dev server
-   [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Sound generation
-   [Vitest](https://vitest.dev/) - Testing framework

## 📝 Usage Tips

1.  **Use Headphones**: For accurate results, use high-quality headphones or earphones.
2.  **Quiet Environment**: Find a quiet room with minimal background noise.
3.  **Calibration**: Follow the on-screen instructions to calibrate your volume before the test begins.
