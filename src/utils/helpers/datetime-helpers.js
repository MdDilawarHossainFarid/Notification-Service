function compareTime(timeString1, timeString2) {
  let dateTiime1 = new Date(timeString1);
  let dateTiime2 = new Date(timeString2);
  return dateTiime1.getTime() > dateTiime2.getTime();
}

module.exports = {
  compareTime,
};
