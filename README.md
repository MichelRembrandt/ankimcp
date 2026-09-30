# ankimcp

An [MCP](https://modelcontextprotocol.io) server that lets an AI assistant add Japanese flash cards to [Anki](https://apps.ankiweb.net/). It talks to Anki through the AnkiConnect add-on and runs over stdio.

## Requirements

- Node.js
- Anki, **running** while the server is used
- The [AnkiConnect](https://foosoft.net/projects/anki-connect/) add-on installed in Anki. The server expects it at `http://127.0.0.1:8765`, its default address.

## Setup

```sh
npm install
npm run build
```

The build output goes to `build/`, and the entry point is `build/index.js`.

## Usage

Register the server with your MCP client. For example, in a Claude Desktop style config:

```json
{
  "mcpServers": {
    "ankimcp": {
      "command": "node",
      "args": ["/absolute/path/to/ankimcp/build/index.js"]
    }
  }
}
```

## Tools

### `add_card`

Adds a flash card with a Japanese word or phrase to the specified Anki deck.

| Parameter     | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `deck`        | Name of the deck the card is added to                          |
| `japanese`    | Japanese word or phrase, in kanji, hiragana or katakana        |
| `reading`     | Reading in hiragana (or the kanji writing for kana-only words) |
| `translation` | English translation                                            |

Each parameter is a string. Translation has 1-120 characters, the others 1–20 characters.

Cards use the `Basic` note type. The front holds the Japanese text, and the back holds the reading and translation separated by a line break. Notes are tagged `ankimcp`, and duplicates are rejected within the same deck.

## Notes

If Anki isn't running or AnkiConnect isn't installed, requests fail with an error saying AnkiConnect could not be reached.
