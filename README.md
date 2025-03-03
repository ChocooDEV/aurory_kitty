# Project Name

## Description
This is a very simple AI-Chat game where you must seduce Kitty, an Aurory Project character. The project was done for a mini-contest on [Twitter](https://x.com/ezdarod/status/1896234073397580084) 

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key (see configuration section below)

## Configuration

### Setting up your OpenAI API Key

This project requires an OpenAI API key to function properly. Follow these steps to set it up:

1. If you don't have an OpenAI API key, sign up at [OpenAI's website](https://platform.openai.com/signup) and create one
2. Create a `.env` file in the root directory of the project
3. Add your API key to the `.env` file in this format:
   ```
   OPENAI_API_KEY='your_api_key_here'
   ```
   Replace `your_api_key_here` with your actual OpenAI API key

**Important**: Never commit your `.env` file to version control. Make sure it's included in your `.gitignore` file.

## Usage

Simply run `npm run dev` and start to chat with Kitty

## Features

Chat with an AI which acts as Kitty, a female AI character.

## Contributing

Every contribution to make the model better are very welcomed!

## License

This project is licensed under the MIT License with Attribution - see below for details:

MIT License

Copyright (c) 2023 [ChocooDev]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Additionally, any project using this software must include visible attribution
to the original author in their documentation and/or user interface.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
