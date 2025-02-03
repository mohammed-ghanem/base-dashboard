import "server-only";

const dictionaries: any = {
  ar: () => import("../dictionaries/ar.json").then((module) => module.default),
  en: () => import("../dictionaries/en.json").then((module) => module.default),

};

export const getDictionary = async (locale: string) => dictionaries[locale]();