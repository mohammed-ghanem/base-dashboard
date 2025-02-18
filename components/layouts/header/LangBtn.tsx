"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LangBtn = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState<string | null>(null);

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    const toggleLanguage = () => {
        if (!currentPath) return;

        // Check if the current path contains '/ar' or '/en'
        const isArabic = currentPath.startsWith('/ar');
        const isEnglish = currentPath.startsWith('/en');

        let newPath;

        if (isArabic) {
            // Switch from Arabic to English
            newPath = currentPath.replace('/ar', '/en');
        } else if (isEnglish) {
            // Switch from English to Arabic
            newPath = currentPath.replace('/en', '/ar');
        } else {
            // No language prefix: assume default is Arabic, add '/en'
            newPath = `/en${currentPath}`;
        }

        // Use Next.js router to navigate to the new path without causing a full page reload
        router.push(newPath); // i stoped this because the lightgalley have issue without reload
        // window.location.href = newPath
    };

    const arabicIcon = <div className='flex items-center border-[1px] bkMainColor border-[#fff] rounded-[15px] px-[6px] py-[3px] mx-[4px] my-[0]'><span className=' font-bold mx-[3px] my-[0] text-[#fff]'>AR</span><FontAwesomeIcon className='text-[#fff] text-xl	' icon={faGlobe} /></div>
    const englishIcon = <div className='flex items-center border-[1px] bkMainColor border-[#fff] rounded-[15px] px-[6px] py-[3px] mx-[4px] my-[0]'><span className=' font-bold mx-[3px] my-[0] text-[#fff]'>EN</span><FontAwesomeIcon className='text-[#fff] text-xl	' icon={faGlobe} /></div>

    return (

        <div>
            <button onClick={toggleLanguage} >
                {currentPath && currentPath.startsWith('/en') ? arabicIcon : englishIcon}
            </button>
        </div>
    );
};

export default LangBtn;