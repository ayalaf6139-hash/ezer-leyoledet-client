export default function Loading() {
    return (
        <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-sm font-semibold text-ink-soft">
            <span className="size-10 animate-spin rounded-full border-4 border-gold-100 border-t-gold-500" />
            טוען...
        </div>
    );
}
