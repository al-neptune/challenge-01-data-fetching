import { useEffect, useReducer } from "react";
import * as DataService from "../services/data";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCHING":
      return { ...initialState, loading: true };
    case "FETCHED":
      return { ...initialState, data: action.payload };
    case "FETCH_ERROR":
      return { ...initialState, error: action.payload };
    default:
      return state;
  }
};

const useFetch = ({ url, payload }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const payloadString = JSON.stringify(payload);

  useEffect(() => {
    let cancelRequest = false;

    const controller = new AbortController();
    const fetchOptions = { signal: controller.signal };
    const payloadObject = JSON.parse(payloadString);

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      DataService.getData(url, payloadObject, fetchOptions)
        .then((data) => {
          if (cancelRequest) return;
          dispatch({ type: "FETCHED", payload: data });
        })
        .catch((error) => {
          if (cancelRequest) return;
          dispatch({ type: "FETCH_ERROR", payload: error.message });
        });
    };

    fetchData();

    return function cleanup() {
      controller.abort();
      cancelRequest = true;
    };
  }, [url, payloadString]);

  return state;
};

export default useFetch;
