import type { ComponentPropsWithoutRef } from 'react';

interface ISkeleton extends ComponentPropsWithoutRef<'div'> {}

function Skeleton({ className = '', ...rest }: ISkeleton) {
	return <div className={`skeleton ${className}`} {...rest} />;
}

export default Skeleton;
