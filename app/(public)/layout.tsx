// app/(public)/layout.tsx

import Navbar from "../components/Navbar/Navbar";



export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}