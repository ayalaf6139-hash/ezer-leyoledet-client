// מחלקות Tailwind שחוזרות בכמה קומפוננטות – מוגדרות כאן פעם אחת כדי לא לשכפל קוד עיצוב

// קו עיטור זהב דק
export const goldLine = 'h-px bg-brand';

// ===== מבנה עמוד – אותו מבנה בכל העמודים =====
export const page = 'space-y-6';
export const pageHeader = 'border-b border-cream-300 pb-6';

// ===== טקסט =====
export const pageTitle = 'font-serif text-3xl font-black tracking-tight text-ink sm:text-4xl';
export const sectionTitle = 'mb-4 font-serif text-xl font-bold text-ink';
export const eyebrow = 'text-xs font-bold tracking-[0.25em] text-gold-600';
export const muted = 'text-sm text-ink-soft';
export const link = 'font-semibold text-gold-700 underline-offset-4 transition hover:text-gold-500 hover:underline';

// ===== כפתורים =====
const btnBase =
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50';
export const btnGold = `${btnBase} bg-brand text-gold-900 shadow-md shadow-gold-600/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-600/30`;
export const btnOutline = `${btnBase} border border-gold-300 bg-white text-gold-700 hover:border-gold-500 hover:bg-gold-50`;
export const btnSmall =
    'cursor-pointer rounded-lg border border-cream-300 bg-white px-3 py-1.5 text-xs font-bold text-gold-700 transition hover:border-gold-400 hover:bg-gold-50 disabled:cursor-not-allowed disabled:opacity-50';
export const btnSmallDanger =
    'cursor-pointer rounded-lg border border-cream-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50';

// ===== כרטיסים =====
export const card = 'rounded-3xl border border-cream-300 bg-white p-6 shadow-[0_18px_45px_-28px_rgba(90,63,18,0.45)]';
export const statTile = 'rounded-2xl border border-cream-300 bg-white p-5 text-center';
export const statNumber = 'block font-serif text-4xl font-black text-gold-600';

// ===== שדות טופס =====
// מעצב את כל התוויות, השדות והודעות השגיאה שבתוך האלמנט, בלי לכתוב מחלקה על כל שדה בנפרד
const fields =
    '[&_label]:text-sm [&_label]:font-semibold [&_label]:text-ink/80 [&_label:has(input)]:flex [&_label:has(input)]:cursor-pointer [&_label:has(input)]:items-center [&_label:has(input)]:gap-2 ' +
    '[&_:is(input,select,textarea)]:rounded-xl [&_:is(input,select,textarea)]:border [&_:is(input,select,textarea)]:border-cream-300 [&_:is(input,select,textarea)]:bg-cream-50 [&_:is(input,select,textarea)]:px-4 [&_:is(input,select,textarea)]:py-2.5 [&_:is(input,select,textarea)]:text-ink [&_:is(input,select,textarea)]:transition ' +
    '[&_:is(input,select,textarea):focus]:border-gold-400 [&_:is(input,select,textarea):focus]:bg-white [&_:is(input,select,textarea):focus]:outline-none [&_:is(input,select,textarea):focus]:ring-4 [&_:is(input,select,textarea):focus]:ring-gold-100 [&_:is(input,select,textarea):disabled]:opacity-60 ' +
    '[&_input[type=checkbox]]:size-4 [&_input[type=checkbox]]:p-0 [&_input[type=checkbox]]:accent-gold-600 ' +
    '[&_span]:text-sm [&_span]:font-medium [&_span]:text-rose-700 [&_small]:text-xs [&_small]:text-ink-soft';

// כל div שיש בו label הוא שדה: התווית, השדה והשגיאה אחד מתחת לשני
export const formFields = `[&>h2]:mb-6 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>div:has(label)]:mb-5 [&>div:has(label)]:flex [&>div:has(label)]:flex-col [&>div:has(label)]:gap-1.5 [&_:is(input,select,textarea)]:w-full [&_textarea]:min-h-24 ${fields}`;
export const form = `${card} sm:p-8 ${formFields}`;
// טופס ארוך בשני טורים: הכותרת, שדות טקסט ארוכים ושורת הכפתורים תופסים את כל הרוחב
export const formGrid = 'grid gap-x-6 sm:grid-cols-2 sm:[&>h2]:col-span-2 sm:[&>div:has(textarea)]:col-span-2 sm:[&>div:last-child]:col-span-2';
export const formButtons = 'mt-2 flex flex-wrap items-center gap-3';
export const filterBar = `flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl border border-cream-300 bg-white px-5 py-4 ${fields}`;
export const filterSide = `${card} flex flex-col gap-3 ${fields}`;

// ===== טבלאות ניהול =====
export const tableWrap = 'overflow-x-auto rounded-3xl border border-cream-300 bg-white shadow-[0_18px_45px_-28px_rgba(90,63,18,0.45)]';
export const table =
    'w-full text-sm [&_th]:whitespace-nowrap [&_th]:border-b-2 [&_th]:border-gold-200 [&_th]:bg-cream-100 [&_th]:px-4 [&_th]:py-3 [&_th]:text-right [&_th]:text-xs [&_th]:font-bold [&_th]:text-ink-soft ' +
    '[&_td]:border-b [&_td]:border-cream-200 [&_td]:px-4 [&_td]:py-3 [&_tbody_tr]:transition [&_tbody_tr:hover]:bg-gold-50/60 [&_tbody_tr:last-child_td]:border-0 [&_td_button]:m-0.5';

// ===== תגית סטטוס – הצבע נקבע לפי data-status =====
export const chip =
    'inline-flex items-center whitespace-nowrap rounded-full bg-cream-200 px-3 py-1 text-xs font-bold text-ink-soft ' +
    'data-[status=ACTIVE]:bg-gold-100 data-[status=ACTIVE]:text-gold-800 data-[status=PUBLISHED]:bg-gold-100 data-[status=PUBLISHED]:text-gold-800 data-[status=OPEN]:bg-gold-100 data-[status=OPEN]:text-gold-800 ' +
    'data-[status=DELIVERED]:bg-olive-50 data-[status=DELIVERED]:text-olive-700 data-[status=TAKEN]:bg-olive-50 data-[status=TAKEN]:text-olive-700 ' +
    'data-[status=PENDING]:bg-white data-[status=PENDING]:text-gold-700 data-[status=PENDING]:ring-1 data-[status=PENDING]:ring-gold-300 data-[status=DRAFT]:bg-white data-[status=DRAFT]:text-gold-700 data-[status=DRAFT]:ring-1 data-[status=DRAFT]:ring-gold-300';

// ===== מסכי כניסה =====
export const authAside =
    'relative hidden flex-col items-center justify-center gap-6 overflow-hidden bg-brand p-12 text-center lg:flex';
export const authFrame = 'pointer-events-none absolute inset-6 rounded-[2rem] border border-white/60';
export const authMain = 'flex min-h-screen items-center justify-center px-4 py-12';
