import AboutApp from '@/components/settingPages/AboutApp'
import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "About App",
};
const page = () => {
    return (
        <div><AboutApp /></div>
    )
}

export default page