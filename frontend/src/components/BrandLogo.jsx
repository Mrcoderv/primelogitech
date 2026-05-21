import React from 'react';

const sizeClasses = {
	sm: 'h-9 w-9',
	md: 'h-12 w-12',
	lg: 'h-16 w-16',
	xl: 'h-24 w-24',
	xxl: 'h-32 w-32',
};

export default function BrandLogo({ size = 'md', className = '', eager = false }) {
	return (
		<img
			src="/primelogitechbg.png"
			alt="Prime Logic Tech logo"
			className={`${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 ${className}`.trim()}
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
		/>
	);
}