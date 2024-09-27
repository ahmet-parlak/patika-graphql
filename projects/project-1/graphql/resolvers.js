import { continents } from "../model/continents.js";
import { countries } from "../model/countries.js";
import { languages } from "../model/languages.js";

const resolvers = {
  Query: {
    continents: () => continents,
    continent: (_, { code }) =>
      continents.find((continent) => continent.code.toLowerCase() === code.toLowerCase()),
    countries: () => countries,
    country: (_, { code }) =>
      countries.find((country) => country.code.toLowerCase() === code.toLowerCase()),
    languages: () => languages,
    language: (_, { code }) =>
      languages.find((language) => language.code.toLowerCase() === code.toLowerCase()),
  },

  Continent: {
    countries: (parent) =>
      parent.countries.map(({ code }) => countries.find((c) => c.code === code)),
  },

  Country: {
    languages: (parent) =>
      parent.languages.map(({ code }) => languages.find((l) => l.code === code)),
    continent: (parent) => {
      let country_contient = null;

      continents.forEach((continent) => {
        continent.countries.forEach((country) => {
          if (country.code === parent.code) {
            country_contient = continent;
          }
        });
      });

      return country_contient;
    },
  },
};

export default resolvers;
