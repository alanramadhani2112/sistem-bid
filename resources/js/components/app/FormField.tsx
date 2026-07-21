import type { ComponentProps, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormFieldProps = Omit<ComponentProps<typeof Input>, 'id' | 'name'> & {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
};

export function FormField({
    label,
    name,
    error,
    required,
    description,
    children,
    type = 'text',
    className,
    ...inputProps
}: FormFieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {children ?? (
                <Input
                    id={name}
                    name={name}
                    type={type}
                    {...inputProps}
                />
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
