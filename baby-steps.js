var sum = 0;

process.argv.forEach(element => {
  if (!isNaN(element)) {
    sum += parseInt(element);
  }
});

console.log(sum);
