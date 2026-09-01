import type { ComponentPropsWithoutRef } from 'react';

type SkeletonProps = ComponentPropsWithoutRef<'div'>;

function Skeleton({ className = '', ...rest }: SkeletonProps) {
	return <div className={`skeleton ${className}`} {...rest} />;
}

export default Skeleton;
