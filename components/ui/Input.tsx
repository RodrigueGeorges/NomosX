const React = require('react');

const {cn} = require('@/lib/utils');

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return <input {...props} className={cn("w-full rounded-2xl bg-panel border border-border px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40", props.className)} />;
}
