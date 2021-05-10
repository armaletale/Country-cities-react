import React, { useState, useEffect } from "react";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.js";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Suspense } from "react";

const languages = [
  {
    code: "en",
    name: "English",
    country_code: "gb",
  },
  {
    code: "hu",
    name: "Magyar",
    country_code: "hu",
  },
  {
    code: "fr",
    name: "Français",
    country_code: "fr",
  },
  {
    code: "ar",
    name: "العربية",
    country_code: "sa",
  },
];

function App() {
  // /// Translation
  // const { t } = useTranslation();

  // //////

  const [countriesName, setContriesName] = useState("");
  const [population, setPopulation] = useState("");
  const [countriesList, setCountriesList] = useState([]);

  const [newPopulation, setNewPopulation] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3003/api/get").then((response) => {
      setCountriesList(response.data);
    });
  }, []);

  const submitReview = () => {
    Axios.post("http://localhost:3003/api/insert", {
      countriesName: countriesName,
      population: population,
    });
    // Add Countries without refesh
    setCountriesList([
      ...countriesList,
      { countriesName: countriesName, population: population },
    ]);
  };

  // Delete a country from the browser connected to the data base

  const deleteCountry = (country) => {
    Axios.delete(`http://localhost:3003/api/delete/${country}`);
  };

  // Update a country from the browser connected to the data base

  const updatePopulation = (country) => {
    Axios.put("http://localhost:3003/api/update", {
      countriesName: country,
      population: newPopulation,
    });
    setNewPopulation("");
  };

  // Page in different language
  const { t } = useTranslation();

  const releaseDate = new Date("2021-05-08");
  const timeDifference = new Date() - releaseDate;
  const number_of_days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return (
    <div className="App">
      {" "}
      <div className="container">
        <div className="d-flex justify-content-end">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              language
            </button>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {languages.map(({ code, name, country_code }) => (
                <li key={country_code}>
                  <button
                    class="dropdown-item"
                    onClick={() => i18next.changeLanguage(code)}
                  >
                    <span
                      className={`flag-icon flag-icon-${country_code} mx-2`}
                    ></span>{" "}
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="d-flex flex-column align-item-start"></div>
        <h1 className="font-weight-normal mb-3 welcometext">
          {t("welcome_message")}
        </h1>

        <p className="instruction">
          {t("days_since_release", { number_of_days })}
        </p>
      </div>
      <div className="form container">
        <h4 className="countryinputtext">
          {t("country")} <span class="label label-default"></span>
        </h4>
        <input
          className="countryInput"
          name="countriesName"
          type="text"
          onChange={(e) => {
            setContriesName(e.target.value);
          }}
        />

        <h4 className="countryinputtext">
          {t("population")} <span class="label label-default"></span>
        </h4>
        <input
          className="countryInput"
          type="number"
          name="countriesPopulation"
          onChange={(e) => {
            setPopulation(e.target.value);
          }}
        />
        <Button variant="success" onClick={submitReview}>
          {t("submit")}
        </Button>

        {countriesList.map((val) => {
          return (
            <div className="cards">
              <div className="card card1">
                <div className="containers">
                  <h2 className="countrytext">
                    {val.countriesName} | {val.population}
                  </h2>
                </div>
                <div className="details">
                  <Button
                    variant="danger"
                    className="deletebutton"
                    onClick={() => {
                      deleteCountry(val.countriesName);
                    }}
                  >
                    {t("delete")}
                  </Button>
                  <input
                    type="text"
                    id="updatePopulation"
                    onChange={(e) => {
                      setNewPopulation(e.target.value);
                    }}
                  />
                  <Button
                    onClick={() => {
                      updatePopulation(val.countriesName);
                    }}
                  >
                    {" "}
                    {t("update")}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
