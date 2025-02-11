
import Dashboard from "@/components/dashboard/Dashboard";
import { getDictionary } from "./dictionaries";



export const dynamic = 'force-static';

type Props = {
  params: { lang: string };
};

export default async function Home({ params }: Props) {

  const { lang } = params;

  const dict = await getDictionary(lang);
  return (
    <div>
      <main className="w-full">
        <Dashboard />
      </main>
    </div>
  );
}
