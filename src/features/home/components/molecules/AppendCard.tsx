import CardForm from '@/features/home/components/molecules/CardForm';
import { useCardSetups } from '@/features/home/hooks/use-card-setups';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function AppendCard() {
  const { appendSetup } = useCardSetups();

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className='
                w-full self-start rounded-2xl
                bg-transparent backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            '
      tabIndex={-1}
    >
      <div
        className='p-4 sm:p-6 flex items-center justify-between cursor-pointer'
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className='text-lg font-semibold'>Add more</h2>
        <PlusIcon
          className={`w-6 h-6 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}
        />
      </div>

      <div
        data-testid='card-form-wrapper'
        className={`
                    grid overflow-hidden
                    transition-[grid-template-rows,opacity] duration-300 ease-out
                    ${expanded ? 'grid-rows-[1fr] opacity-100 px-6 pb-6' : 'grid-rows-[0fr] opacity-0'}
                `}
      >
        <div className='overflow-hidden'>
          <CardForm onButtonClick={appendSetup} />
        </div>
      </div>
    </div>
  );
}

export default AppendCard;
