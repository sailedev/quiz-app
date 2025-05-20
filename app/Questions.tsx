import { FC } from 'react';
import { QuestionType } from './types/types';

type Props = {
	question: QuestionType;
	selected: string | null;
	onSelect: (choice: string) => void;
};

const Question: FC<Props> = ({ question, selected, onSelect }) => {
	return (
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-4'>{question.question}</h2>
			<ul className='space-y-2'>
				{question.choices.map((choice) => (
					<li key={choice}>
						<button
							onClick={() => onSelect(choice)}
							className={`w-full p-2 border rounded ${
								selected === choice ? 'bg-blue-300' : 'bg-white'
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
