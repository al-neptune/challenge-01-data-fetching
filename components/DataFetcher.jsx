import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import useFetch from "../hooks/useFetch";

export const ChallengeUI = () => {
  const { account } = useEthers();

  const url = "/api/hello";
  const address = account || ethers.constants.AddressZero;

  const { loading, data, error } = useFetch({
    url,
    payload: {
      address,
    },
  });

  console.log({ loading, data, error });

  return (
    <>
      <h1>Data from API</h1>
      <pre>
        {!data && loading
          ? "Retrieving data from API..."
          : JSON.stringify(data, null, 2)}
      </pre>
    </>
  );
};
