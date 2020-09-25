const collapsibleIcons = [...(document.querySelectorAll('.collapsible-icons'))]
let index

M.Tabs.init(document.querySelectorAll('.tabs'), {
  swipeable : false
});

// console.log(collapsibleItems);
M.Collapsible.init(document.getElementById('collapsible'), {
  onOpenStart: getItem,
  onCloseStart: () => transformArrow(index)
  
})

function getItem() {
  // IMPORTANT: Se coloca toda la funcion dentro de un setTimeout() para dar chance a que se coloque la clase "active"
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
    transformArrow(index)
  }, 0);
}

function transformArrow(i) {
  collapsibleIcons[i].classList.toggle('transform-arrow')
}