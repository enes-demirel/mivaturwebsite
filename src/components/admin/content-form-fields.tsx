export const adminInput="mt-1.5 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm normal-case outline-none focus:border-brand focus:ring-3 focus:ring-brand/10";
export const adminTextarea=`${adminInput} py-3`;
export function AdminField({label,children,className=""}:{label:string;children:React.ReactNode;className?:string}){return <label className={`block min-w-0 text-sm font-semibold text-text ${className}`}>{label}{children}</label>;}
