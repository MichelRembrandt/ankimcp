import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createAnkiNote, addCard } from './anki.js';

export function buildServer() {
    const server = new McpServer({
        name: 'task-server',
        version: '1.0.0'
    });

    server.registerTool(
        'add_card',
        {
            title: 'Add card to anki',
            description: 'Add a flash card with a japanese phrase or word to the specified anki deck',
            inputSchema: {
                deck: z.string().min(1).max(20).describe('Title of the deck the card will be added to'),
                japanese: z.string().min(1).max(20).describe('Japanese word or phrase that will be studied - in kanji, hiragan or katakana'),
                emoji: z.string().min(1).max(5).describe('(Combination of) emoji(s) representing the Japanese word'),
                reading: z.string().min(1).max(20).describe('Reading of the word or phrase in hiragana. Alternatively this can contain the kanji writing of a word that is usually written in hiragana'),
                translation: z.string().min(1).max(120).describe('English translation of the word or phrase. Limit to the most straight forward translation(s) to ensure simplicity while studying the word')
            }
        },
        async ({ deck, japanese, emoji, reading, translation }) => {
            const ankiNote = createAnkiNote(deck, japanese, emoji, reading, translation);
            const response = await addCard(ankiNote);
            return {
                content: [{ type: 'text', text: JSON.stringify(response) }]
            };
        }
    );

    return server;
}

