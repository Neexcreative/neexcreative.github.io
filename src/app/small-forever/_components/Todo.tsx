/**
 * A visible placeholder for a business fact that still needs confirming.
 * Every <Todo> must be resolved before the legal pages go to production;
 * search the repo for "<Todo" to find them all.
 */
export default function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-[#fde68a] px-1 text-[#3b2a24]">[TODO: {children}]</mark>;
}
