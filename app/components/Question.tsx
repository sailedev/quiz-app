import { FC } from 'react';
import { QuestionType } from '../types/types';

type Props = {
	question: QuestionType;
	selected: string | null;
	onSelect: (choice: string) => void;
};

const Question: FC<Props> = ({ question, selected, onSelect }) => {
	return (
		<div>
			<h2 className='text-xl font-bold mb-4'>{question.question}</h2>
			<ul className='space-y-2'>
				{question.choices.map((choice) => (
					<li key={choice}>
						<button
							onClick={() => onSelect(choice)}
							className={`w-full p-3 border rounded transition-all text-left ${
								selected === choice
									? 'bg-blue-200 border-blue-500 font-medium'
									: 'bg-black hover:bg-gray-100 border-gray-300'
							}`}
						>
							{choice}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Question;
