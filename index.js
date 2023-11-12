// when the document finish loading
document.addEventListener("DOMContentLoaded", () => {
  const mealSearchInput = document.getElementById("mealsearch");
  const mealsContainer = document.getElementById("meals-ctr");
  const mealDetails = document.getElementById("meal-details");
  const favsArea = document.getElementById("favs-area");

  // get favourites list from the local storage and update the favourite list
  let favorites = JSON.parse(localStorage.getItem("favouritesList")) || [];
  updateFavouritesList();

  // here we setup input event listener on the meal search box
  mealSearchInput.addEventListener("input", searchMeals);

  // function to search meals
  function searchMeals() {
    var userInput = mealSearchInput.value.trim();

    if (userInput === "") {
      mealsContainer.innerHTML = "";
      return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
      .then((response) => response.json())
      .then((data) => displaySearchResults(data.meals));
  }

  // function to display search results we got in the above function
  function displaySearchResults(meals) {
    mealsContainer.innerHTML = "";

    meals.forEach((meal) => {
      const newMealCard = document.createElement("div");
      newMealCard.classList.add("meal-card");
      newMealCard.innerHTML = `
          <img class="meal-card-img" src=${meal.strMealThumb} alt="tasty meal thumbnail" />
          <div class="meal-card-text">
            <h4>Name: ${meal.strMeal}</h4>
            <h4>Category: ${meal.strCategory}</h4>
            <h4>Type: ${meal.strArea}</h4>
          </div>
          <div class="meal-card-btns">
            <button class="details-btn">Details</button>
            <button class="fav-btn">Fav ❤️</button>
          </div>
      `;

      // Adding onclick listener to details-btn
      const detailsButton = newMealCard.querySelector(".details-btn");
      detailsButton.addEventListener("click", () => showMealDetails(meal));

      // Adding onclick listener to fav-btn
      const favButton = newMealCard.querySelector(".fav-btn");
      favButton.addEventListener("click", () => addToFavourites(meal));

      mealsContainer.appendChild(newMealCard);
    });
  }

  // function to show meal details
  function showMealDetails(meal) {
    mealsContainer.style.display = "none";
    mealDetails.innerHTML = "";

    const detailsData = `
        <h2>${meal.strMeal}</h2>
        <img src=${meal.strMealThumb} alt="meal image" />
        <div class="meal-details-para">
          <p>Category : ${meal.strCategory}</p>
          <p>Instructions : ${meal.strInstructions}</p>
        </div>
    `;

    mealDetails.insertAdjacentHTML("beforeend", detailsData);
  }

  // function to show meals again after pressing back from details
  function showMealsAgain() {}

  // function to add meal to favorite
  function addToFavourites(meal) {
    if (!favorites.find((fav) => fav.idMeal === meal.idMeal)) {
      favorites.push(meal);
      localStorage.setItem("favouritesList", JSON.stringify(favorites));
      updateFavouritesList();
    }
  }

  // function to update favorite list
  function updateFavouritesList() {
    favsArea.innerHTML = "";

    favorites.forEach((fav) => {
      const newMealCard = document.createElement("div");
      newMealCard.classList.add("meal-card");
      newMealCard.innerHTML = `
        <img class="meal-card-img" src=${fav.strMealThumb} alt="tasty meal" />
        <h4>Name: ${fav.strMeal}</h4>
        <button class="remove-fav-btn">Remove</button>
      `;

      // Adding onclick listener to remove-fav-btn
      const removeFavBtn = newMealCard.querySelector(".remove-fav-btn");
      removeFavBtn.addEventListener("click", () => removeFromFavourites(fav));

      favsArea.appendChild(newMealCard);
    });
  }

  // function to remove from the favorites
  function removeFromFavourites(meal) {
    favorites = favorites.filter((fav) => fav.idMeal !== meal.idMeal);
    localStorage.setItem("favouritesList", JSON.stringify(favorites));
    updateFavouritesList();
  }
});
