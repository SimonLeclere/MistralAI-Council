# The Council of Wisdom

A Next.js application powered by Mistral AI that summons a council of historical and fictional figures to debate your questions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Mistral AI API Key.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd mistral-council
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add your Mistral API key:
    ```env
    MISTRAL_API_KEY=your_api_key_here
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🧪 How to Test

1.  Enter a philosophical or complex question in the input field (e.g., "Is artificial intelligence truly creative?").
2.  Click the send button.
3.  Wait for the Council to be summoned (loading state).
4.  Observe the personas appearing on the stage.
5.  Read the dialogue as it appears sequentially.
6.  Read the final decree.

## 📝 License

MIT
