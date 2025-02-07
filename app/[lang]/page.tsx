
import SideBar from "@/components/sidebar/SideBar";
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
        {/* <h1 className="">header navbar</h1> */}
        {/* <h1 className="">{dict.pages.homePage.statistics.Books}</h1> */}
        <SideBar/>
      </main>
    </div>
  );
}
