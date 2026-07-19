import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormFieldProps = {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    children?: ReactNode;
    type?: string;
    defaultValue?: string | number;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    accept?: string;
    className?: string;
};

export function FormField({
    label,
    name,
    error,
    required,
    children,
    type = 'text',
    defaultValue,
    placeholder,
    min,
    max,
    step,
    accept,
    className,
}: FormFieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {children ?? (
                <Input
                    accept={accept}
                    defaultValue={defaultValue}
                    id={name}
                    max={max}
                    min={min}
                    name={name}
                    placeholder={placeholder}
                    step={step}
                    type={type}
                />
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
