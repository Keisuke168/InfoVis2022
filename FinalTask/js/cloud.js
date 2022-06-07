var dic = {};
var word = {};

d3.csv("https://keisuke168.github.io/InfoVis2022/Finaltask/netflix.csv")
    .then(data => {
        data.forEach(d => {
          var year = d['Netflix Release Date'].match(/\d{4}/)
          dic[year] = dic[year] ? dic[year]+ ', ' + d.Genre : d.Genre
        })
        Object.keys(dic).forEach(k => dic[k] = dic[k].split(', '))
        word = wordCount(dic);

        let wd = new WordCloud(word);
        wd.update(2017)

        const inputSliderBarElement = document.getElementById('inputSlideBar');
        inputSliderBarElement.addEventListener('change', function() {
          document.getElementById('year').innerHTML = inputSliderBarElement.value;
          wd.update(inputSliderBarElement.value)
      });
    });

function wordCount(dict) {
  var word = {}
  Object.keys(dict).forEach(year => {
    word[year] = []
    var num  = dict[year].length
    var unique = Array.from(new Set(dict[year]))
    unique.forEach(genre => {
      word[year].push({text: genre, size: dict[year].filter(elem => elem === genre).length/num *700  + 10, test:'haha'})
    })
  })
  return word
}