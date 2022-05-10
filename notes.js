var i = 1;
var rayBox = [];

function star() {
  for (var i = 0; i < 20; i++) {
    console.log(i);
  }
}

star();


$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);


var currentSection = localStorage.getItem('currentSection')
console.log(currentSection)

if (currentSection === 'reading'){

localStorage.setItem('currentSection', "writing");

} else if (currentSection === 'writing') {

localStorage.setItem('currentSection', "completed");}

else {
 localStorage.setItem('currentSection', "reading");
}