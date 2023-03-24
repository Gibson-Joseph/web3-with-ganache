// https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624174#learning-tools

import contract from "@truffle/contract";
export const loadContract = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`);

  const Artifact = await res.json();
  // https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624178#learning-tools
  const _contract = contract(Artifact);

  _contract.setProvider(provider);

  let deployedContract = null;

  try {
    deployedContract = await _contract.deployed();
  } catch (error) {
    console.error("You are connected to the wrong network");
  }

  return deployedContract;
};
