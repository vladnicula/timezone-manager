const getDataValueByKey = (node, keyName) => {
  while (node && (!node.dataset || !node.dataset[keyName])) {
    node = node.parentNode;
  }

  if (!node || !node.dataset) {
    return null;
  }

  return node.dataset[keyName];
};

export { getDataValueByKey };
