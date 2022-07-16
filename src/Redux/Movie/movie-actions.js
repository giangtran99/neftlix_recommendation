import MovieActionTypes from "./movie-types";
import {
  fetchData,
  fetchAdditionalMovieData
} from "../../Services/MovieService";
import { fetchGrid } from "../../Services/MovieGridService";

export const getMoviesSuccess = () => ({
  type: MovieActionTypes.SET_MOVIE_DATA_SUCCESS
});

export function getMovies(userId = 1) {
  return dispatch => {
    fetchData().then(data => {
      const movieData = data.map(({ results }) => results);
      var newArray = Array.prototype.concat.apply([], movieData);
      fetch(`http://localhost:8000/reccomend-item/${userId}`)
        .then(response => response.json())
        .then(data => {
          Promise.all(data.map(item => fetch(`https://api.themoviedb.org/3/movie/${item.tmdbId}?api_key=9f1ffd64abd4bde18614fd9087d87d71&language=en-US&query=infinity`).then(res => res.json())))
            .then(values => {
              let arr = newArray.concat(values)
              console.log("arr",arr)
              dispatch({
                type: MovieActionTypes.SET_MOVIE_DATA,
                payload: arr
              });
            })

        })
      console.log(newArray);

    });

    fetchGrid().then(data => {
      const movieGridData = data.map(({ results }) => results[0]);
      var newArray = Array.prototype.concat.apply([], movieGridData);
      dispatch({
        type: MovieActionTypes.SET_MOVIE_GRID_DATA,
        payload: newArray
      });
      dispatch(getMoviesSuccess());
    });
  };

}

export const getMoviesAdditionalSuccess = () => ({
  type: MovieActionTypes.SET_MOVIE_ADDITIONAL_DATA_SUCCESS
});

export function getAdditionalMovieData(id) {
  return dispatch => {
    fetchAdditionalMovieData(id).then(data => {
      dispatch({
        type: MovieActionTypes.SET_MOVIE_ADDITIONAL_DATA,
        payload: data
      });
      dispatch(getMoviesAdditionalSuccess());
    });
  };
}
