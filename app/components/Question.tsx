import { FC } from 'react';
import { QuestionType } from '../types/types';

type Props = {
	question: QuestionType;
	selected: number | null;
	onSelect: (choiceIndex: number) => void;
};

const Question: FC<Props> = ({ question, selected, onSelect }) => (
	<div>
		<h2 className='text-xl font-bold mb-4'>{question.question}</h2>
		<ul className='space-y-2'>
			{question.choices.map((choice, idx) => (
				<li key={idx}>
					<button
						onClick={() => onSelect(idx)}
						className={`w-full p-3 text-black border rounded transition-all text-left ${
							selected === idx
								? 'bg-blue-200 border-blue-500 font-medium'
								: 'bg-white hover:bg-gray-100 border-gray-300'
						}`}
					>
						{choice}
					</button>
				</li>
			))}
		</ul>
	</div>
);

export default Question;
