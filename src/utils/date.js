const checkDateDiff = (dateEnd) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date();
  const secondDate = new Date(dateEnd);
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  return diffDays;
};

export { checkDateDiff };
