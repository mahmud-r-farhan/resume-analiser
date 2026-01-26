# Resume Copilot - Mobile App

A modern, cross-platform mobile application built with Flutter to help candidates personalize their resumes using AI. This app connects to the Resume Copilot backend to serve detailed analysis and job fit scoring.

## 🚀 Key Features

*   **Smart Analysis**: Upload a PDF resume and paste a job description to get instant feedback.
*   **Visual Reports**: Beautiful fit score gauge and markdown-rendered detailed analysis.
*   **Modern UI/UX**: Clean design with smooth animations (`animate_do`) and responsive layout.
*   **Theming**: Full support for System, Light, and Dark modes.
*   **State Management**: Robust architecture using **Riverpod**.

## 🛠️ Tech Stack

*   **Framework**: Flutter (Dart)
*   **State Management**: `flutter_riverpod`
*   **Networking**: `dio`
*   **UI Components**: `google_fonts`, `dotted_border`, `flutter_markdown`
*   **File Handling**: `file_picker`

## 🏃‍♂️ Getting Started

### Prerequisites
1.  Ensure the **Backend** is running on port `5000`.
2.  [Flutter SDK](https://flutter.dev/docs/get-started/install) installed.

### Installation

1.  Navigate to the app directory:
    ```bash
    cd app
    ```
2.  Install dependencies:
    ```bash
    flutter pub get
    ```
3.  Run the application:
    ```bash
    flutter run
    ```

## ⚙️ Configuration

The app is pre-configured to connect to the backend:
*   **Android Emulator**: Connects to `http://10.0.2.2:5000/api`
*   **Web/iOS/Desktop**: Connects to `http://localhost:5000/api`

*Note: To change the base URL, modify `lib/core/config/api_config.dart`.*
