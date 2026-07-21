import type { ReactNode } from 'react';

import { BackLink } from '@/components/app/BackLink';
import { PageHeader } from '@/components/app/PageHeader';
import { PageShell } from '@/components/app/PageShell';
import { SectionCard } from '@/components/app/SectionCard';

type FormPageShellProps = {
    accent?: string;
    backHref: string;
    cardDescription?: ReactNode;
    cardTitle?: ReactNode;
    children: ReactNode;
    subtitle?: string;
    title: string;
};

export function FormPageShell({ accent = 'Admin', backHref, cardDescription, cardTitle, children, subtitle, title }: FormPageShellProps) {
    return (
        <PageShell spacing="sm">
            <BackLink href={backHref} />
            <PageHeader accent={accent} subtitle={subtitle} title={title} />
            <SectionCard description={cardDescription} title={cardTitle}>{children}</SectionCard>
        </PageShell>
    );
}
