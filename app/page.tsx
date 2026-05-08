"use client";

import { useEffect, useState } from "react";

type Deck = {
  id: string;
  name: string;
  cards: Card[];
};

type Card = {
  id: string;
  front: string;
  back: string;
  correctCount: number;
  nextReviewAt: string;
  deck?: { name: string };
};

export default function Home() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password123");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckName, setDeckName] = useState("");
  const [selectedDeck, setSelectedDeck] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [dueCards, setDueCards] = useState<Card[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  async function api(path: string, options: RequestInit = {}) {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.json();
  }

  async function register() {
    const data = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json());

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setXp(data.user.xp);
    }
  }

  async function login() {
    const data = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json());

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setXp(data.user.xp);
    }
  }

  async function loadDecks() {
    const data = await api("/api/decks");
    setDecks(data);
  }

  async function createDeck() {
    await api("/api/decks", {
      method: "POST",
      body: JSON.stringify({ name: deckName }),
    });

    setDeckName("");
    loadDecks();
  }

  async function createCard() {
    if (!selectedDeck) return;

    await api(`/api/decks/${selectedDeck}/cards`, {
      method: "POST",
      body: JSON.stringify({ front, back }),
    });

    setFront("");
    setBack("");
    loadDecks();
  }

  async function loadDueCards() {
    const data = await api("/api/study/due");
    setDueCards(data);
    setShowAnswer(false);
  }

  async function answerCard(correct: boolean) {
    if (!dueCards.length) return;

    const data = await api("/api/study/answer", {
      method: "POST",
      body: JSON.stringify({
        cardId: dueCards[0].id,
        correct,
      }),
    });

    if (data.user) setXp(data.user.xp);

    setDueCards((cards) => cards.slice(1));
    setShowAnswer(false);
  }

  const currentCard = dueCards[0];

  if (!token) {
    return (
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-4">FlashLearn</h1>

          <input
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="border p-2 w-full mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />

          <div className="flex gap-3">
            <button
              onClick={login}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Login
            </button>

            <button
              onClick={register}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold">FlashLearn</h1>
          <p>XP: {xp}</p>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded mt-3"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">Create Deck</h2>

          <input
            className="border p-2 rounded mr-2"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Deck name"
          />

          <button
            onClick={createDeck}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add Deck
          </button>

          <button
            onClick={loadDecks}
            className="ml-2 bg-gray-700 text-white px-4 py-2 rounded"
          >
            Load Decks
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">Add Card</h2>

          <select
            className="border p-2 rounded w-full mb-3"
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value)}
          >
            <option value="">Choose deck</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded w-full mb-3"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front"
          />

          <input
            className="border p-2 rounded w-full mb-3"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back"
          />

          <button
            onClick={createCard}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Card
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">Study Mode</h2>

          <button
            onClick={loadDueCards}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Load Due Cards
          </button>

          {!currentCard && <p>No due cards.</p>}

          {currentCard && (
            <div>
              <h3 className="text-2xl font-bold">{currentCard.front}</h3>

              {showAnswer && (
                <p className="mt-4 p-4 bg-gray-200 rounded">
                  {currentCard.back}
                </p>
              )}

              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-black text-white px-4 py-2 rounded mt-4"
                >
                  Show Answer
                </button>
              ) : (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => answerCard(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Correct
                  </button>

                  <button
                    onClick={() => answerCard(false)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Incorrect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}