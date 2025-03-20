import ContactInfo from "@/components/settingPages/ContactInfo"
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Contact Info",
};
const page = () => {
  return (
    <div><ContactInfo/></div>
  )
}

export default page