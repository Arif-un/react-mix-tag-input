export default function SectionLink({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <a href={`#${id}`} className="underline text-blue-500 hover:text-blue-600">
      {children}
    </a>
  );
}
