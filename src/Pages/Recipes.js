import React, { useState, useEffect } from "react";
import Axios from "axios";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import "../style/Recipes.css";

export default function Recipes() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [activeRecipes, setActiveRecipes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  // console.log(recipes)
  const searchRecipes = async () => {
    if (query !== "") {
      setIsLoading(true);
      const result = await Axios.get(url);
      console.log(result);
      setRecipes(result.data.meals);
      setActiveRecipes(recipes.slice(0, 8));
      setQuery("");
      setIsLoading(false);
    }
  };

  // instant search
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(url);
      console.log(result);
      setRecipes(result.data.meals);
      setActiveRecipes(recipes.slice(0, 8));
    };
    fetchData().catch(console.error);
  }, [query]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.offsetHeight
    )
      return;
    setIsFetching(true);
  }

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreListItems();
  }, [isFetching]);

  function fetchMoreListItems() {
    setTimeout(() => {
      setActiveRecipes((prevState) => {
        console.log(`Previous state: ${prevState}`);
        return [
          ...prevState,
          ...recipes.slice(prevState.length + 1, prevState.length + 9),
        ];
      });
      setIsFetching(false);
    }, 2000);
  }

  const onChange = async (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  const clearInput = () => {
    setRecipes([]);
    setQuery("");
  };

  return (
    <div className="recipes">
      <div className="search-box">
        <h1>Recipe App</h1>
        <SearchBar
          handleSubmit={handleSubmit}
          value={query}
          name="name"
          onChange={onChange}
          isLoading={isLoading}
        />

        {query.length !== 0 && (
          <div className="close-icon" onClick={clearInput}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
            </svg>
          </div>
        )}

        <div className="search-result">
          {activeRecipes &&
            query !== "" &&
            activeRecipes.slice(0, 5).map((val) => {
              return (
                <a
                  className="search-item"
                  href={val.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={val.idMeal}
                >
                  <p>{val.strMeal}</p>
                </a>
              );
            })}
        </div>
      </div>
      <div className="recipes-container">
        {recipes && query !== null
          ? activeRecipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))
          : "We're sorry! No recipe found."}
      </div>
      {isFetching && "Loading more recipes..."}
    </div>
  );
}
