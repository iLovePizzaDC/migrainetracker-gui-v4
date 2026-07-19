import { UserCircleIcon } from '@heroicons/react/24/outline';

function LoadingBox() {
  return (
    <div className='py-20 flex items-center justify-center'>
      <div className='relative flex flex-col items-center gap-2'>
        <div
          className='
                        backdrop-blur-xl bg-white/10
                        border border-white/25
                        rounded-3xl px-12 py-10
                        shadow-2xl text-center
                        flex flex-col items-center gap-4
                    '
        >
          <div className='relative w-20 h-20'>
            <div className='w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-xl font-medium'>
              <UserCircleIcon className='w-16 h-16 text-white/50' />
            </div>

            <div
              className='absolute -inset-2 rounded-full border-2 border-transparent border-t-white/80 border-r-white/20 animate-spin'
              style={{ animationDuration: '1.6s' }}
            />

            <div
              className='absolute -inset-4 rounded-full border-2 border-transparent border-t-white/40 border-r-white/10 animate-spin'
              style={{ animationDuration: '2.4s', animationDirection: 'reverse' }}
            />
          </div>

          <p className='pt-5 text-white/60 text-sm font-light tracking-widest'>Logging in...</p>

          <div className='w-full h-0.5 bg-white/15 rounded-full overflow-hidden'>
            <div className='h-full bg-white/70 rounded-full animate-[shimmer_1.6s_ease-in-out_infinite]' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingBox;
