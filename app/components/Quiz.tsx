import { useState } from 'react';
import { QuestionType } from '../types/types';
import Question from './Question';

type Props = {
	questions: QuestionType[];
	onRetry: () => void;
};

const Quiz = ({ questions, onRetry }: Props) => {
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<(number | null)[]>(
		new Array(questions.length).fill(null)
	);

	const [finished, setFinished] = useState(false);

	const handleSelect = (choice: string) => {
		const newAnswers = [...answers];
		newAnswers[current] = Number(choice);
		setAnswers(newAnswers);
	};

	const next = () => {
		if (current < questions.length - 1) {
			setCurrent((prev) => prev + 1);
		} else {
			setFinished(true);
		}
	};

	const score = answers.filter((a, i) => a === questions[i].answer).length;

	if (finished) {
		return (
			<div className='p-4 max-w-3xl mx-auto'>
				<h2 className='text-2xl font-bold mb-4 text-center'>Resultat</h2>
				<p className='mb-6 text-center text-lg'>
					Du fikk <span className='font-semibold'>{score}</span> av{' '}
					{questions.length} riktige.
				</p>

				<div className='space-y-8'>
					{questions.map((q, i) => {
						const userAnswer = answers[i];
						const isCorrect = userAnswer === q.answer;

						return (
							<div key={i} className='p-6 border rounded-lg shadow-sm bg-white'>
								<h3 className='font-semibold mb-4 text-lg text-black'>
									{q.question}
								</h3>
								<ul className='space-y-2'>
									{q.choices.map((choice) => {
										const isUserChoice = userAnswer === choice;
										const isCorrectAnswer = q.answer === choice;

										let bg = 'bg-white';
										let border = 'border-gray-300';
										let text = 'text-gray-800';
										let icon = '';

										if (isCorrectAnswer && isUserChoice) {
											bg = 'bg-green-100';
											border = 'border-green-500';
											text = 'text-green-800 font-semibold';
											icon = ' ✅';
										} else if (isUserChoice && !isCorrectAnswer) {
											bg = 'bg-red-100';
											border = 'border-red-500';
											text = 'text-red-800 font-semibold';
											icon = ' ❌';
										} else if (isCorrectAnswer) {
											bg = 'bg-green-50';
											border = 'border-green-300';
											text = 'text-green-700 italic';
											icon = ' ✅';
										}

										return (
											<li
												key={choice}
												className={`p-3 rounded border ${bg} ${border} ${text}`}
											>
												{choice}
												{icon}
											</li>
										);
									})}
								</ul>
							</div>
						);
					})}
				</div>
				{/* 🔁 PRØV IGJEN */}
				<div className='text-center'>
					<button
						onClick={onRetry}
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						Prøv igjen
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='p-4 max-w-xl mx-auto'>
			<div className='mb-4 text-sm text-gray-600'>
				Spørsmål {current + 1} av {questions.length}
			</div>
			<Question
				question={questions[current]}
				selected={answers[current]}
				onSelect={handleSelect}
			/>
			<button
				onClick={next}
				disabled={answers[current] == null}
				className='mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
			>
				{current < questions.length - 1 ? 'Neste' : 'Fullfør'}
			</button>
		</div>
	);
};

export default Quiz;
