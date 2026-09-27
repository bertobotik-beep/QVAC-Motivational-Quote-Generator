# QVAC Motivational Quote Generator

Describe a struggle or goal and an on-device AI writes a short, original motivational quote grounded in that specific situation — not a generic inspirational quote pulled from nowhere. No cloud call, no API key.

## How it works

1. You type a struggle or goal (e.g. `I'm trying to finish my first marathon next month but I keep getting injured.`) into the input field and submit.
2. The server asks the on-device model for one short, original, quotable line (under 28 words) that directly references your specific situation, rather than a generic saying that could apply to anything.
3. The reply is streamed token-by-token and cleaned up (stripped of quotes and preambles like "Here's...").
4. `logic.js` checks the result is actually grounded in your situation (`isGrounded`, requiring at least one shared keyword) and isn't a refusal or too long; if either check fails, it falls back to a guaranteed on-topic quote built directly from your exact words.

### Example

- Input: `I'm trying to finish my first marathon next month but I keep getting injured.`
- Typical output: `"Your body is healing the very foundation that will carry you across that marathon finish line."`

### QVAC functions used

- `loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0 })` — loads the model on-device at startup (`src/gui.js`).
- `completion({ modelId, history, stream: true, completionOpts })` — generates the quote, streamed via `run.tokenStream` (`src/logic.js`).
- `unloadModel({ modelId })` — releases the model when the server shuts down (`src/gui.js`).

## Run

```bash
npm install
npm start
```

Then open http://localhost:31021

The port can be overridden with the `PORT` environment variable.

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## License

MIT
