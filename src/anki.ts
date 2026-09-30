const ANKI_CONNECT_URL = "http://127.0.0.1:8765";
const ANKI_CONNECT_VERSION = 6;

export interface AnkiConnectResponse<T> {
    result: T;
    error: string | null;
}

interface AnkiNotePicture {
    url: string;
    filename: string;
    fields: string[];
}

export interface AnkiNote {
    deckName: string;
    modelName: string;
    fields: Record<string, string>;
    tags?: string[];
    options?: {
        allowDuplicate?: boolean;
        duplicateScope?: string;
    };
    picture?: AnkiNotePicture[];
}

export function createAnkiNote(
    deck: string,
    japanese: string,
    emoji: string,
    reading: string,
    translation: string
): AnkiNote {
    return {
        deckName: deck,
        modelName: 'Basic',
        fields: {
            Front: japanese,
            Back: `${emoji}<br>${reading}<br>${translation}`,
        },
        tags: ["ankimcp"],
        options: {
            allowDuplicate: false,
            duplicateScope: "deck",
        },
    };
}

async function invoke<T = unknown>(
    action: string,
    params: Record<string, unknown> = {}
): Promise<T> {
    const res = await fetch(ANKI_CONNECT_URL, {
        method: "POST",
        body: JSON.stringify({ action, version: ANKI_CONNECT_VERSION, params }),
    }).catch((err: Error) => {
        throw new Error(`Could not reach AnkiConnect at ${ANKI_CONNECT_URL}. Is Anki running? (${err.message})`);
    });

    const { result, error } = (await res.json()) as AnkiConnectResponse<T>;
    if (error) throw new Error(`AnkiConnect error on "${action}": ${error}`);
    return result;
}

async function getDeckNames(): Promise<string[]> {
    return invoke<string[]>("deckNames");
}

async function ensureDeckExists(deckName: string): Promise<void> {
    const decks = await getDeckNames();
    if (!decks.includes(deckName)) {
        await invoke("createDeck", { deck: deckName });
    }
}

export async function addCard(
    note: AnkiNote,
): Promise<number> {
    await ensureDeckExists(note.deckName);
    return invoke<number>("addNote", { note });
}
