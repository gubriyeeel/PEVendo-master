import Footer from "@/app/ui/sections/Footer";
import Header from "@/app/ui/sections/HeaderA";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
