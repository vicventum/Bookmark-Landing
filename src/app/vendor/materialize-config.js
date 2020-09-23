const collapsibleIcons = [...(document.querySelectorAll('.collapsible-icons'))]
let index
// const collapsibleItems = [...(document.querySelectorAll('ul.collapsible li'))]
// let icon
// let index = "none"

// collapsibleItems.forEach(el => {
//   el.addEventListener('click', activeItem)
// });

M.Tabs.init(document.querySelectorAll('.tabs'), {

});

// console.log(collapsibleItems);
M.Collapsible.init(document.getElementById('collapsible'), {
  onOpenStart: () => {

    setTimeout(() => {
      
      // Collapsible Instance
      const collapsibleItems = [...(document.querySelectorAll('ul.collapsible li'))]
      let i = 0
  
      for (const el of collapsibleItems) {
        if (el.classList.contains("active")) {
          index = i;
        }
        i++
      }
      console.log(index);
      
      transformArrow(index, true)
    }, 0);
  },
  // onCloseStart: () => {
  // icon.style.color = 'hsl(231, 69%, 60%)'
  // icon.innerHTML = '▼'
  // }
  onCloseStart: () => {
    transformArrow(index, false)
  }
})

function activeItem(e) {
  icon = e.target.firstElementChild
  icon.style.color = 'hsl(0, 94%, 66%)'
  icon.innerHTML = '▲'
  console.log(e);
  console.log(e.target.firstElementChild);
}

function transformArrow(i, mode) {
  if (mode) {
    collapsibleIcons[i].style.transform = 'rotate(180deg)'
    collapsibleIcons[i].style.color = 'hsl(0, 94%, 66%)'
  } else {
    collapsibleIcons[i].style.transform = 'rotate(0deg)'
    collapsibleIcons[i].style.color = 'hsl(231, 69%, 60%)'
  }
}