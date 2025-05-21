'use client';

import { useState } from 'react';
import Quiz from './components/Quiz';
import { QuestionType } from './types/types';

/**
 * Returnerer et tilfeldig utvalg av maks `count` elementer fra arrayet.
 */
function pluckRandomSubset<T>(array: T[], count: number): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result.slice(0, Math.min(count, array.length));
}

export default function Home() {
	const [questions, setQuestions] = useState<QuestionType[] | null>(null);
	const [numberOfQuestions, setNumberQuestions] = useState(0);

	// ✅ Last opp egen fil
	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const json = JSON.parse(
					event.target?.result as string
				) as QuestionType[];
				const selected = pluckRandomSubset(json, 20);
				setQuestions(selected);
			} catch (error) {
				alert('Ugyldig JSON-fil');
			}
		};
		reader.readAsText(file);
	};

	// ✅ Bruk eksempelquiz fra public/example.json
	const loadDatakomm = async () => {
		try {
			const res = await fetch('/datakomm.json');
			const data = await res.json();
			const selected = pluckRandomSubset(data as QuestionType[], 20);
			setQuestions(selected);
		} catch (err) {
			alert('Kunne ikke laste eksempelquiz' + err);
		}
	};

	// 🔁 Start på nytt
	const resetQuiz = () => setQuestions(null);

	return (
		<main className='min-h-screen bg-gray-950 text-white p-8 flex flex-col items-center'>
			<div className='max-w-3xl w-full'>
				{!questions ? (
					<div>
						<h1 className='text-3xl font-bold mb-6 text-center'>
							Last opp Quiz-fil
						</h1>
						<div className='space-y-4 text-center'>
							<input
								type='file'
								accept='.json'
								onChange={handleFile}
								className='file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700'
							/>
							<p className='text-sm text-gray-400'>eller</p>
							<button
								onClick={loadDatakomm}
								className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700'
							>
								Datakomm json fil (/datakomm.json)
							</button>
						</div>
					</div>
				) : (
					<Quiz questions={questions} onRetry={resetQuiz} />
				)}
			</div>
		</main>
	);
}
