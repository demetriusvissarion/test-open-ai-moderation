# OpenAI Content Moderation Demo

A React-based web application that demonstrates OpenAI's content moderation capabilities for both text and images. This project showcases how to integrate OpenAI's moderation API to detect potentially harmful or inappropriate content.

## Features

- **Text Moderation**: Upload and analyze text content for policy violations
- **Image Moderation**: Upload images and analyze them for inappropriate content
- **Real-time Analysis**: Get instant moderation results with detailed category scores
- **Modern UI**: Clean, responsive interface built with React and Vite

## Technology Stack

- **Frontend**: React 19 with Vite
- **Backend**: Netlify Functions (serverless)
- **AI Services**: OpenAI Moderation API
- **Image Storage**: Cloudinary
- **Styling**: Custom CSS with modern design patterns

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Cloudinary account (for image uploads)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd test-open-ai-moderation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For local Netlify Functions testing:
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Main landing page
│   │   ├── TextModeration.jsx    # Text moderation interface
│   │   └── ImageModeration.jsx   # Image moderation interface
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # App entry point
├── netlify/
│   └── functions/
│       └── moderate.js           # Serverless function for moderation
└── public/                       # Static assets
```

## API Integration

The application uses OpenAI's `omni-moderation-latest` model to analyze content across multiple categories including:

- Violence
- Hate speech
- Sexual content
- Self-harm
- Harassment
- And more...

## Deployment

This project is configured for deployment on Netlify with:

- Automatic builds from Git
- Serverless functions for API handling
- Environment variable management

## Security Notes

- All API keys are stored as environment variables
- No sensitive information is hardcoded in the source code
- The application is designed for demonstration purposes

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
