import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CategoryTabOption = {
    label: string;
    value: string;
};

type CategoryTabProps = {
    options: CategoryTabOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

export function CategoryTab({ className, onChange, options, value }: CategoryTabProps) {
    return (
        <div className={cn('flex gap-2 overflow-x-auto pb-1', className)} role="tablist">
            {options.map((option) => {
                const active = option.value === value;

                return (
                    <Button
                        aria-selected={active}
                        className="min-h-11 shrink-0"
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        role="tab"
                        type="button"
                        variant={active ? 'default' : 'outline'}
                    >
                        {option.label}
                    </Button>
                );
            })}
        </div>
    );
}
